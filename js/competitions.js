/* ========================================
   METARUSH — Competition System
   PvP Arena competition logic & data
   ======================================== */

class CompetitionManager {
  constructor() {
    this.competitions = this.generateCompetitions();
    this.timers = {};
  }

  generateCompetitions() {
    return [
      {
        id: 'eth-arena-001',
        type: 'ETH vs ETH Arena',
        chain: 'eth',
        chainLabel: 'Ethereum',
        prizePool: 2.5,
        currency: 'ETH',
        currencyIcon: 'Ξ',
        entryFee: 0.05,
        maxParticipants: 50,
        currentParticipants: 38,
        endsIn: 3600 + Math.floor(Math.random() * 3600), // seconds
        status: 'live',
        participants: this.generateParticipants(38, 'eth'),
        description: 'Classic Ethereum showdown. 50 players enter, one walks away with the prize pool.',
      },
      {
        id: 'sol-sprint-001',
        type: 'SOL vs SOL Sprint',
        chain: 'sol',
        chainLabel: 'Solana',
        prizePool: 45,
        currency: 'SOL',
        currencyIcon: '◎',
        entryFee: 1.0,
        maxParticipants: 50,
        currentParticipants: 42,
        endsIn: 1800 + Math.floor(Math.random() * 1800),
        status: 'live',
        participants: this.generateParticipants(42, 'sol'),
        description: 'Fast-paced Solana sprint. Quick rounds, big rewards.',
      },
      {
        id: 'eth-whale-001',
        type: 'Whale Battle',
        chain: 'eth',
        chainLabel: 'Ethereum',
        prizePool: 10,
        currency: 'ETH',
        currencyIcon: 'Ξ',
        entryFee: 0.5,
        maxParticipants: 20,
        currentParticipants: 14,
        endsIn: 7200 + Math.floor(Math.random() * 3600),
        status: 'filling',
        participants: this.generateParticipants(14, 'eth'),
        description: 'High-stakes battle for whales only. Limited spots, massive rewards.',
      },
      {
        id: 'eth-arena-002',
        type: 'ETH vs ETH Arena',
        chain: 'eth',
        chainLabel: 'Ethereum',
        prizePool: 1.2,
        currency: 'ETH',
        currencyIcon: 'Ξ',
        entryFee: 0.025,
        maxParticipants: 50,
        currentParticipants: 50,
        endsIn: 0,
        status: 'ended',
        winner: '0x7aB3...f2D1',
        participants: this.generateParticipants(50, 'eth'),
        description: 'Recently completed arena battle.',
      },
      {
        id: 'sol-sprint-002',
        type: 'SOL vs SOL Sprint',
        chain: 'sol',
        chainLabel: 'Solana',
        prizePool: 30,
        currency: 'SOL',
        currencyIcon: '◎',
        entryFee: 0.75,
        maxParticipants: 40,
        currentParticipants: 22,
        endsIn: 5400 + Math.floor(Math.random() * 2700),
        status: 'filling',
        participants: this.generateParticipants(22, 'sol'),
        description: 'Mid-range Solana competition with solid odds.',
      },
      {
        id: 'base-arena-001',
        type: 'BASE Battle Royale',
        chain: 'base',
        chainLabel: 'Base',
        prizePool: 1.8,
        currency: 'ETH',
        currencyIcon: 'Ξ',
        entryFee: 0.03,
        maxParticipants: 60,
        currentParticipants: 35,
        endsIn: 4500 + Math.floor(Math.random() * 2000),
        status: 'live',
        participants: this.generateParticipants(35, 'eth'),
        description: 'Battle on Base chain. Low gas, high rewards.',
      },
    ];
  }

  generateParticipants(count, chain) {
    const participants = [];
    const chars = '0123456789abcdef';
    const b58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

    for (let i = 0; i < count; i++) {
      let addr;
      if (chain === 'sol') {
        addr = '';
        for (let j = 0; j < 44; j++) addr += b58[Math.floor(Math.random() * b58.length)];
        addr = addr.slice(0, 4) + '...' + addr.slice(-4);
      } else {
        addr = '0x';
        for (let j = 0; j < 40; j++) addr += chars[Math.floor(Math.random() * chars.length)];
        addr = addr.slice(0, 6) + '...' + addr.slice(-4);
      }
      participants.push({
        address: addr,
        entries: Math.floor(Math.random() * 3) + 1,
        joinedAt: Date.now() - Math.floor(Math.random() * 3600000),
      });
    }
    return participants;
  }

  formatTime(seconds) {
    if (seconds <= 0) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  startTimers(callback) {
    setInterval(() => {
      let updated = false;
      for (const comp of this.competitions) {
        if (comp.endsIn > 0 && comp.status !== 'ended') {
          comp.endsIn--;
          updated = true;
          if (comp.endsIn <= 0) {
            comp.status = 'ended';
            const winner = comp.participants[Math.floor(Math.random() * comp.participants.length)];
            comp.winner = winner.address;
          }
        }
      }
      if (updated && callback) callback();
    }, 1000);
  }

  getActiveCompetitions() {
    return this.competitions.filter(c => c.status !== 'ended');
  }

  getCompetitionById(id) {
    return this.competitions.find(c => c.id === id);
  }

  enterCompetition(id) {
    const comp = this.getCompetitionById(id);
    if (!comp || comp.status === 'ended') return false;
    if (comp.currentParticipants >= comp.maxParticipants) return false;

    comp.currentParticipants++;
    const shortAddr = window.wallet?.shortenAddress(window.wallet.address) || '0xYou...r123';
    comp.participants.push({
      address: shortAddr,
      entries: 1,
      joinedAt: Date.now(),
    });

    return true;
  }
}

// Global instance
window.competitionManager = new CompetitionManager();
