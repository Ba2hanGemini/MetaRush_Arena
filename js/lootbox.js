/* ========================================
   METARUSH — Loot Box System
   Box tiers, opening animation, rewards
   ======================================== */

class LootBoxManager {
  constructor() {
    this.boxes = [
      {
        id: 'bronze',
        tier: 'Bronze',
        icon: '📦',
        price: 0.01,
        currency: 'ETH',
        minReward: 0.005,
        maxReward: 0.05,
        rarities: {
          common:    { chance: 0.50, multiplierRange: [0.5, 0.8],  label: 'Common',    color: '#64748b' },
          uncommon:  { chance: 0.30, multiplierRange: [0.8, 1.5],  label: 'Uncommon',  color: '#10b981' },
          rare:      { chance: 0.15, multiplierRange: [1.5, 3.0],  label: 'Rare',      color: '#06b6d4' },
          epic:      { chance: 0.04, multiplierRange: [3.0, 5.0],  label: 'Epic',      color: '#7c3aed' },
          legendary: { chance: 0.01, multiplierRange: [5.0, 10.0], label: 'Legendary', color: '#f59e0b' },
        },
        gradient: 'linear-gradient(135deg, #92400e, #b45309)',
        glowColor: 'rgba(180, 83, 9, 0.4)',
      },
      {
        id: 'silver',
        tier: 'Silver',
        icon: '🗃️',
        price: 0.05,
        currency: 'ETH',
        minReward: 0.02,
        maxReward: 0.25,
        rarities: {
          common:    { chance: 0.40, multiplierRange: [0.4, 0.8],  label: 'Common',    color: '#64748b' },
          uncommon:  { chance: 0.30, multiplierRange: [0.8, 1.5],  label: 'Uncommon',  color: '#10b981' },
          rare:      { chance: 0.20, multiplierRange: [1.5, 3.0],  label: 'Rare',      color: '#06b6d4' },
          epic:      { chance: 0.08, multiplierRange: [3.0, 5.0],  label: 'Epic',      color: '#7c3aed' },
          legendary: { chance: 0.02, multiplierRange: [5.0, 10.0], label: 'Legendary', color: '#f59e0b' },
        },
        gradient: 'linear-gradient(135deg, #6b7280, #9ca3af)',
        glowColor: 'rgba(156, 163, 175, 0.4)',
      },
      {
        id: 'gold',
        tier: 'Gold',
        icon: '🎁',
        price: 0.1,
        currency: 'ETH',
        minReward: 0.05,
        maxReward: 1.0,
        rarities: {
          common:    { chance: 0.30, multiplierRange: [0.5, 0.8],  label: 'Common',    color: '#64748b' },
          uncommon:  { chance: 0.30, multiplierRange: [0.8, 1.5],  label: 'Uncommon',  color: '#10b981' },
          rare:      { chance: 0.25, multiplierRange: [1.5, 3.0],  label: 'Rare',      color: '#06b6d4' },
          epic:      { chance: 0.12, multiplierRange: [3.0, 6.0],  label: 'Epic',      color: '#7c3aed' },
          legendary: { chance: 0.03, multiplierRange: [6.0, 15.0], label: 'Legendary', color: '#f59e0b' },
        },
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        glowColor: 'rgba(245, 158, 11, 0.4)',
      },
      {
        id: 'diamond',
        tier: 'Diamond',
        icon: '💎',
        price: 0.5,
        currency: 'ETH',
        minReward: 0.25,
        maxReward: 5.0,
        rarities: {
          common:    { chance: 0.20, multiplierRange: [0.5, 0.8],  label: 'Common',    color: '#64748b' },
          uncommon:  { chance: 0.30, multiplierRange: [0.8, 1.5],  label: 'Uncommon',  color: '#10b981' },
          rare:      { chance: 0.28, multiplierRange: [1.5, 3.0],  label: 'Rare',      color: '#06b6d4' },
          epic:      { chance: 0.17, multiplierRange: [3.0, 6.0],  label: 'Epic',      color: '#7c3aed' },
          legendary: { chance: 0.05, multiplierRange: [6.0, 20.0], label: 'Legendary', color: '#f59e0b' },
        },
        gradient: 'linear-gradient(135deg, #818cf8, #6366f1)',
        glowColor: 'rgba(129, 140, 248, 0.4)',
      },
    ];

    this.isOpening = false;
    this.onResult = null;
  }

  getBox(id) {
    return this.boxes.find(b => b.id === id);
  }

  rollRarity(box) {
    const roll = Math.random();
    let cumulative = 0;

    for (const [key, rarity] of Object.entries(box.rarities)) {
      cumulative += rarity.chance;
      if (roll <= cumulative) {
        return { key, ...rarity };
      }
    }
    // Fallback to common
    return { key: 'common', ...box.rarities.common };
  }

  calculateReward(box, rarity) {
    const [minMult, maxMult] = rarity.multiplierRange;
    const multiplier = minMult + Math.random() * (maxMult - minMult);
    const reward = box.price * multiplier;
    return Math.round(reward * 10000) / 10000;
  }

  async openBox(boxId) {
    if (this.isOpening) return null;

    const box = this.getBox(boxId);
    if (!box) return null;

    this.isOpening = true;

    // Roll the result
    const rarity = this.rollRarity(box);
    const reward = this.calculateReward(box, rarity);
    const isWin = reward >= box.price;
    const isJackpot = rarity.key === 'legendary';

    const result = {
      box,
      rarity,
      reward,
      isWin,
      isJackpot,
      currency: box.currency,
    };

    return result;
  }

  finishOpening() {
    this.isOpening = false;
  }

  createConfetti(container) {
    const colors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#818cf8', '#ef4444'];
    const confettiCount = 60;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.setProperty('--fall-duration', (2 + Math.random() * 2) + 's');
      confetti.style.setProperty('--fall-delay', (Math.random() * 0.5) + 's');
      confetti.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
      confetti.style.width = (Math.random() * 8 + 4) + 'px';
      confetti.style.height = (Math.random() * 8 + 4) + 'px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(confetti);

      // Cleanup
      setTimeout(() => confetti.remove(), 4000);
    }
  }
}

// Global instance
window.lootBoxManager = new LootBoxManager();
