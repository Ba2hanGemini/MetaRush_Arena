/* ========================================
   METARUSH — Tournament System
   Modes: 1v1 · 2v2 · 4v4
   Coins: ETH · SOL · AVAX · BNB · TRX
   Fee: %5 platform fee — only on profit
   ======================================== */

class TournamentManager {
  constructor() {
    /* ── Mode Definitions ── */
    this.modes = {
      '1v1': { label: '1 vs 1', players: 2, winnerTeamSize: 1, perTeam: 1, modeLabel: 'Bireysel' },
      '2v2': { label: '2 vs 2', players: 4, winnerTeamSize: 2, perTeam: 2, modeLabel: 'Takım (4 kişi)' },
      '4v4': { label: '4 vs 4', players: 8, winnerTeamSize: 4, perTeam: 4, modeLabel: 'Takım (8 kişi)' },
    };

    /* ── Coin Definitions ── */
    this.coins = {
      ETH:  { symbol: 'ETH',  color: '#627eea', minEntry: 0.001 },
      SOL:  { symbol: 'SOL',  color: '#9945ff', minEntry: 0.01  },
      AVAX: { symbol: 'AVAX', color: '#e84142', minEntry: 0.01  },
      BNB:  { symbol: 'BNB',  color: '#f3ba2f', minEntry: 0.01  },
      TRX:  { symbol: 'TRX',  color: '#ef0027', minEntry: 1.0   },
    };

    this.PLATFORM_FEE = 0.05; // 5% of profit only

    /* ── Active State ── */
    this.currentMode = '1v1';
    this.currentCoin = 'ETH';
    this.currentEntry = 1;

    /* ── Sample Tournament Data ── */
    this.tournaments = this._generateTournaments();
  }

  /* ─────────────────────────────────────────
     PAYOUT CALCULATION ENGINE
     Formula:
       totalPot   = players × entryAmount
       grossPerWinner = totalPot / winnerTeamSize
       profit     = grossPerWinner - entryAmount
       fee        = profit × 0.05
       netPayout  = grossPerWinner - fee
       platformIncome = fee × winnerTeamSize
  ───────────────────────────────────────── */
  calculatePayout(mode, coin, entryAmount) {
    const m = this.modes[mode];
    if (!m || !this.coins[coin] || entryAmount <= 0) return null;

    const totalPot       = m.players * entryAmount;
    const grossPerWinner = totalPot / m.winnerTeamSize;
    const profit         = grossPerWinner - entryAmount;
    const fee            = profit * this.PLATFORM_FEE;
    const netPayout      = grossPerWinner - fee;
    const platformIncome = fee * m.winnerTeamSize;
    const roi            = ((netPayout - entryAmount) / entryAmount) * 100;

    return {
      mode, coin, entryAmount,
      totalPot,
      grossPerWinner,
      profit,
      fee,
      netPayout,
      platformIncome,
      roi,
      players:        m.players,
      winnerTeamSize: m.winnerTeamSize,
    };
  }

  /* ── Format number with smart decimals ── */
  fmt(n, coin) {
    const decimals = coin === 'TRX' ? 2 : 4;
    return parseFloat(n.toFixed(decimals)).toString();
  }

  /* ── Generate sample tournament data ── */
  _generateTournaments() {
    const statuses = ['open', 'filling', 'live'];
    const modes    = ['1v1', '2v2', '4v4'];
    const coins    = ['ETH', 'SOL', 'AVAX', 'BNB', 'TRX'];

    const entries = {
      ETH:  [0.1, 0.5, 1, 2, 5],
      SOL:  [0.5, 1, 5, 10, 25],
      AVAX: [1, 5, 10, 25, 50],
      BNB:  [0.1, 0.5, 1, 2, 5],
      TRX:  [100, 500, 1000, 5000],
    };

    const list = [];
    let id = 1;

    // Generate 12 diverse tournaments
    const specs = [
      { mode: '1v1', coin: 'ETH',  entry: 1,    status: 'open',    current: 1 },
      { mode: '1v1', coin: 'SOL',  entry: 5,    status: 'filling', current: 1 },
      { mode: '2v2', coin: 'ETH',  entry: 0.5,  status: 'open',    current: 2 },
      { mode: '2v2', coin: 'BNB',  entry: 1,    status: 'live',    current: 4 },
      { mode: '4v4', coin: 'ETH',  entry: 2,    status: 'open',    current: 3 },
      { mode: '4v4', coin: 'SOL',  entry: 10,   status: 'filling', current: 6 },
      { mode: '1v1', coin: 'AVAX', entry: 10,   status: 'open',    current: 0 },
      { mode: '1v1', coin: 'TRX',  entry: 1000, status: 'filling', current: 1 },
      { mode: '2v2', coin: 'AVAX', entry: 5,    status: 'open',    current: 1 },
      { mode: '4v4', coin: 'BNB',  entry: 0.5,  status: 'open',    current: 2 },
      { mode: '2v2', coin: 'ETH',  entry: 5,    status: 'live',    current: 4 },
      { mode: '4v4', coin: 'TRX',  entry: 500,  status: 'open',    current: 4 },
    ];

    for (const s of specs) {
      const m      = this.modes[s.mode];
      const payout = this.calculatePayout(s.mode, s.coin, s.entry);
      list.push({
        id:           `T${String(id++).padStart(3, '0')}`,
        mode:         s.mode,
        modeLabel:    m.label,
        coin:         s.coin,
        entry:        s.entry,
        maxPlayers:   m.players,
        currentJoined: s.current,
        status:       s.status,
        payout,
        endsIn:       Math.floor(Math.random() * 7200) + 600, // seconds
      });
    }

    return list;
  }

  getTournamentById(id) {
    return this.tournaments.find(t => t.id === id);
  }

  getFiltered(modeFilter) {
    if (modeFilter === 'all') return this.tournaments;
    return this.tournaments.filter(t => t.mode === modeFilter);
  }

  /* ── Timer formatting ── */
  formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}s ${m}d`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
}

window.tournamentManager = new TournamentManager();
