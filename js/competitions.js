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
        endsIn: 3600 + Math.floor(Math.random() * 3600),
        status: 'live',
        participants: this.generateParticipants(38, 'eth'),
        description: 'Classic Ethereum showdown. 50 players enter, one walks away with the prize pool.',
      },
      {
        id: 'bnb-smart-001',
        type: 'BNB Jackpot',
        chain: 'bnb',
        chainLabel: 'BSC',
        prizePool: 15,
        currency: 'BNB',
        currencyIcon: 'BNB',
        entryFee: 0.1,
        maxParticipants: 100,
        currentParticipants: 85,
        endsIn: 2400 + Math.floor(Math.random() * 2000),
        status: 'live',
        participants: this.generateParticipants(85, 'bnb'),
        description: 'High-speed BNB jackpot on BSC. Provably fair rewards.',
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
        id: 'xrp-ripple-001',
        type: 'XRP Blitz',
        chain: 'xrp',
        chainLabel: 'Ripple',
        prizePool: 2500,
        currency: 'XRP',
        currencyIcon: 'XRP',
        entryFee: 50,
        maxParticipants: 30,
        currentParticipants: 12,
        endsIn: 5400 + Math.floor(Math.random() * 3600),
        status: 'filling',
        participants: this.generateParticipants(12, 'xrp'),
        description: 'Global XRP blitz. Fast settlement, massive pools.',
      },
      {
        id: 'avax-rush-001',
        type: 'AVAX Avalanche',
        chain: 'avax',
        chainLabel: 'Avalanche',
        prizePool: 120,
        currency: 'AVAX',
        currencyIcon: 'AVAX',
        entryFee: 2.5,
        maxParticipants: 40,
        currentParticipants: 28,
        endsIn: 4500 + Math.floor(Math.random() * 1200),
        status: 'live',
        participants: this.generateParticipants(28, 'avax'),
        description: 'Avalanche network rush. Sub-second finality pvp.',
      },
      {
        id: 'trx-tron-001',
        type: 'TRON Battle',
        chain: 'trx',
        chainLabel: 'Tron',
        prizePool: 15000,
        currency: 'TRX',
        currencyIcon: 'TRX',
        entryFee: 300,
        maxParticipants: 60,
        currentParticipants: 55,
        endsIn: 1200 + Math.floor(Math.random() * 600),
        status: 'live',
        participants: this.generateParticipants(55, 'trx'),
        description: 'Massive TRON battle. Lowest fees, highest participation.',
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
      }
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
      } else if (chain === 'trx') {
        addr = 'T';
        for (let j = 0; j < 33; j++) addr += b58[Math.floor(Math.random() * b58.length)];
        addr = addr.slice(0, 5) + '...' + addr.slice(-4);
      } else if (chain === 'xrp') {
        addr = 'r';
        for (let j = 0; j < 33; j++) addr += b58[Math.floor(Math.random() * b58.length)];
        addr = addr.slice(0, 5) + '...' + addr.slice(-4);
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
