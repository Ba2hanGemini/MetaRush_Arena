/* ========================================
   METARUSH — Main Application Controller
   ui-ux-pro-max + design-spells skill applied
   Aesthetic: Cyber-Luxury Futurist — DFII 14/15
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const app = new MetaRushApp();
  app.init();
  window.metaRushApp = app;
});

class MetaRushApp {
  constructor() {
    /* ── DOM References ── */
    this.header         = document.getElementById('header');
    this.mobileMenuBtn  = document.getElementById('mobile-menu-btn');
    this.nav            = document.getElementById('main-nav');
    this.connectBtn     = document.getElementById('connect-wallet-btn');
    this.ctaConnectBtn  = document.getElementById('cta-connect-btn');
    this.balanceDisplay = document.getElementById('balance-display');
    this.balanceAmount  = document.getElementById('balance-amount');
    this.walletAddrDisplay = document.getElementById('wallet-address-display');
    this.walletAddrText    = document.getElementById('wallet-addr-text');

    /* ── Modals ── */
    this.walletModal  = document.getElementById('wallet-modal');
    this.compModal    = document.getElementById('competition-modal');
    this.lootboxModal = document.getElementById('lootbox-modal');
    this.confettiContainer = document.getElementById('confetti-container');

    /* ── Content Areas ── */
    this.competitionsGrid = document.getElementById('competitions-grid');
    this.lootboxGrid      = document.getElementById('lootbox-grid');
    this.leaderboardBody  = document.getElementById('leaderboard-body');

    /* ── State ── */
    this._activeFilter = 'all';
    this._lbData = this.generateLeaderboardData();
  }

  init() {
    this.setupScrollEffects();
    this.setupMobileMenu();
    this.setupWalletUI();
    this.setupNavigation();
    this.setupFilterTabs();
    this.setupModalCloseHandlers();
    this.setupCTAButton();
    this.renderCompetitions();
    this.renderLootBoxes();
    this.renderLeaderboard();
    this.startAnimatedCounters();
    this.setupScrollReveal();
    this.setupMagneticButtons();
    this.setupLeaderboardTabs();
    this.setupTournaments();
    this.preloadHeroVideo(); // New: Load once to memory for smooth loop

    /* Live competition timers */
    if (window.competitionManager) {
      window.competitionManager.startTimers(() => this.updateCompetitionTimers());
    }
  }

  /* ══════════════════════════════════════
     SCROLL EFFECTS — header glass pill
  ══════════════════════════════════════ */
  setupScrollEffects() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.header.classList.toggle('scrolled', window.scrollY > 40);
          this.updateActiveNavLink();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  updateActiveNavLink() {
    const sections = ['hero', 'competitions', 'lootboxes', 'leaderboard'];
    const scrollMid = window.scrollY + window.innerHeight / 2;

    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && el.offsetTop <= scrollMid) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[data-section="${sections[i]}"]`);
        if (activeLink) activeLink.classList.add('active');
        break;
      }
    }
  }

  /* ══════════════════════════════════════
     MOBILE MENU — design-spell: slide-in
  ══════════════════════════════════════ */
  setupMobileMenu() {
    if (!this.mobileMenuBtn) return;
    this.mobileMenuBtn.addEventListener('click', () => {
      const isOpen = this.nav.classList.toggle('open');
      this.mobileMenuBtn.classList.toggle('open', isOpen);
      this.mobileMenuBtn.setAttribute('aria-expanded', isOpen.toString());
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (!this.nav.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
        this.nav.classList.remove('open');
        this.mobileMenuBtn.classList.remove('open');
        this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ══════════════════════════════════════
     NAVIGATION
  ══════════════════════════════════════ */
  setupNavigation() {
    document.querySelectorAll('[data-section]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(link.dataset.section);
        if (!target) return;

        const headerOffset = 90;
        const y = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });

        this.nav.classList.remove('open');
        this.mobileMenuBtn?.classList.remove('open');
        this.mobileMenuBtn?.setAttribute('aria-expanded', 'false');

        /* Update active nav */
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const navLink = document.querySelector(`.nav-link[data-section="${link.dataset.section}"]`);
        if (navLink) navLink.classList.add('active');
      });
    });
  }

  /* ══════════════════════════════════════
     WALLET UI — design-spell: reveal glow
  ══════════════════════════════════════ */
  setupWalletUI() {
    /* Main connect button */
    this.connectBtn?.addEventListener('click', () => {
      if (window.wallet?.connected) {
        window.wallet.disconnect();
      } else {
        this.openModal(this.walletModal);
      }
    });

    /* Wallet option selection */
    document.querySelectorAll('.wallet-option').forEach(option => {
      option.addEventListener('click', () => this.connectWallet(option.dataset.wallet));
    });

    /* Wallet state callbacks */
    if (window.wallet) {
      window.wallet.onConnect = (info) => this.handleWalletConnect(info);
      window.wallet.onDisconnect = () => this.handleWalletDisconnect();
    }

    /* Click wallet address to disconnect */
    this.walletAddrDisplay?.addEventListener('click', () => {
      if (window.wallet?.connected) window.wallet.disconnect();
    });
  }

  handleWalletConnect(info) {
    /* Update connect button */
    this.connectBtn.innerHTML = `
      <svg width="8" height="8" viewBox="0 0 8 8" fill="#10b981" aria-hidden="true"><circle cx="4" cy="4" r="4"/></svg>
      ${info.shortAddress}
    `;
    this.connectBtn.classList.add('connected');

    /* Show balance */
    this.balanceDisplay.classList.add('visible');
    if (this.balanceAmount) this.balanceAmount.textContent = `${info.balance} ${info.chain}`;

    /* Show wallet address chip */
    this.walletAddrDisplay.classList.add('visible');
    if (this.walletAddrText) this.walletAddrText.textContent = info.shortAddress;

    this.closeModal(this.walletModal);
    this.showToast('success', `Wallet connected — ${info.shortAddress}`);

    /* Update any enter buttons */
    document.querySelectorAll('.comp-enter-btn[disabled]').forEach(btn => {
      if (btn.textContent.includes('Connect')) {
        btn.disabled = false;
        btn.textContent = btn.getAttribute('data-enter-text') || 'Enter Competition';
      }
    });
  }

  handleWalletDisconnect() {
    this.connectBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="4" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/>
        <path d="M1 7h14" stroke="currentColor" stroke-width="1.3"/>
        <circle cx="11" cy="10" r="1.2" fill="currentColor"/>
      </svg>
      Connect
    `;
    this.connectBtn.classList.remove('connected');
    this.balanceDisplay.classList.remove('visible');
    this.walletAddrDisplay.classList.remove('visible');
    this.showToast('info', 'Wallet disconnected');
  }

  async connectWallet(walletType) {
    const optionsEl   = this.walletModal.querySelector('.wallet-options');
    const connectingEl = this.walletModal.querySelector('.wallet-connecting');
    const labelEl      = this.walletModal.querySelector('.wallet-connecting-label');

    const names = { metamask: 'MetaMask', phantom: 'Phantom', walletconnect: 'WalletConnect' };
    if (labelEl) labelEl.textContent = `Connecting to ${names[walletType] || walletType}...`;

    if (optionsEl)    optionsEl.style.display = 'none';
    if (connectingEl) connectingEl.classList.add('active');

    await window.wallet?.connect(walletType);

    if (optionsEl)    optionsEl.style.display = '';
    if (connectingEl) connectingEl.classList.remove('active');
  }

  /* ══════════════════════════════════════
     CTA BUTTON
  ══════════════════════════════════════ */
  setupCTAButton() {
    this.ctaConnectBtn?.addEventListener('click', () => {
      if (window.wallet?.connected) {
        const target = document.getElementById('competitions');
        if (target) window.scrollTo({ top: target.offsetTop - 90, behavior: 'smooth' });
      } else {
        this.openModal(this.walletModal);
      }
    });
  }

  /* ══════════════════════════════════════
     COMPETITION FILTER TABS
  ══════════════════════════════════════ */
  setupFilterTabs() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        this._activeFilter = tab.dataset.filter;
        this.renderCompetitions();
      });
    });
  }

  /* ══════════════════════════════════════
     COMPETITION RENDERING
  ══════════════════════════════════════ */
  renderCompetitions() {
    if (!this.competitionsGrid || !window.competitionManager) return;

    let comps = window.competitionManager.competitions;
    if (this._activeFilter !== 'all') {
      comps = comps.filter(c => c.chain === this._activeFilter);
    }

    this.competitionsGrid.innerHTML = comps.map(comp => this.competitionCardHTML(comp)).join('');

    /* Bind click events */
    this.competitionsGrid.querySelectorAll('.comp-card').forEach(card => {
      card.addEventListener('click', () => this.openCompetitionDetail(card.dataset.id));
    });

    /* Staggered reveal animation */
    this.competitionsGrid.querySelectorAll('.comp-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.transition = 'opacity 400ms ease, transform 400ms cubic-bezier(0.16,1,0.3,1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 80);
      });
    });
  }

  competitionCardHTML(comp) {
    const progress = Math.round((comp.currentParticipants / comp.maxParticipants) * 100);
    const timeStr = window.competitionManager.formatTime(comp.endsIn);

    const chainSVG = {
      /* ETH — Official Ethereum Diamond */
      eth:  `<svg width="12" height="18" viewBox="0 0 784 1277" fill="none"><polygon points="392,0 392,472 784,650" fill="#627eea" opacity=".8"/><polygon points="392,0 0,650 392,472" fill="#627eea" opacity=".6"/><polygon points="392,882 784,650 392,472" fill="#627eea" opacity=".9"/><polygon points="392,882 0,650 392,472" fill="#627eea" opacity=".7"/><polygon points="392,956 392,1277 784,724" fill="#627eea" opacity=".8"/><polygon points="392,1277 392,956 0,724" fill="#627eea" opacity=".6"/></svg>`,
      /* BNB — Official Binance 4-Diamond + center */
      bnb:  `<svg width="12" height="12" viewBox="0 0 80 80" fill="none"><path d="M40 0L24 16l16 16 16-16L40 0zm0 48L24 64l16 16 16-16L40 48zm24-24L48 40l16 16 16-16-16-16zM16 24L0 40l16 16 16-16-16-16zm24 8L32 40l8 8 8-8-8-8z" fill="#f3ba2f"/></svg>`,
      /* SOL — Official Solana 3-bar Parallelogram */
      sol:  `<svg width="14" height="11" viewBox="0 0 398 312" fill="none"><path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="#9945ff"/><path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="#9945ff"/><path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="#9945ff"/></svg>`,
      /* XRP — Official Ripple X-shape */
      xrp:  `<svg width="12" height="10" viewBox="0 0 512 424" fill="none"><path d="M437 0h74L357 152.48c-55.77 55.19-146.19 55.19-202 0L.94 0H75L192 115.83a91.11 91.11 0 0 0 127.91 0z" fill="#ffffff"/><path d="M74.05 424H0l155-153.42c55.77-55.19 146.19-55.19 202 0L512 424h-74L320 307.23a91.11 91.11 0 0 0-127.91 0z" fill="#ffffff"/></svg>`,
      /* AVAX — Official Avalanche A-shape */
      avax: `<svg width="12" height="12" viewBox="250 220 1000 870" fill="none"><path d="M538.688 1050.86H392.94c-30.626 0-45.754 0-54.978-5.9-9.963-6.46-16.051-17.16-16.789-28.97-.554-10.88 7.011-24.168 22.139-50.735L703.182 330.935c15.313-26.936 23.062-40.404 32.84-45.385 10.516-5.35 23.062-5.35 33.578 0 9.778 4.981 17.527 18.449 32.839 45.385l73.982 129.144.377.659c16.539 28.897 24.926 43.551 28.588 58.931 4.058 16.789 4.058 34.5 0 51.289-3.69 15.497-11.992 30.257-28.781 59.591L687.573 964.702l-.489.856c-16.648 29.135-25.085 43.901-36.778 55.042-12.73 12.18-28.043 21.03-44.832 26.02-15.313 4.24-32.47 4.24-66.786 4.24z" fill="#e84142"/><path d="M906.75 1050.86h208.84c30.81 0 46.31 0 55.54-6.08 9.96-6.46 16.23-17.35 16.79-29.15.53-10.53-7.37-23.3-21.87-48.323l-1.51-1.601-104.61-178.956-1.19-2.015c-14.7-24.858-22.12-37.411-31.65-42.263-10.51-5.351-22.88-5.351-33.391 0-9.594 4.981-17.342 18.08-32.655 44.462L857.306 964.891l-.357.616c-15.259 26.34-22.885 39.503-22.335 50.303.738 11.81 6.826 22.69 16.788 29.15 9.041 5.9 24.538 5.9 55.348 5.9z" fill="#e84142"/></svg>`,
      /* TRX — Official TRON Arrow */
      trx:  `<svg width="12" height="12" viewBox="0 0 64 64" fill="none"><path d="M61.55 19.28c-3-2.77-7.15-7-10.53-10l-.2-.14a3.82 3.82 0 0 0-1.11-.62C41.56 7 3.63-.09 2.89 0a1.4 1.4 0 0 0-.58.22l-.19.15a2.23 2.23 0 0 0-.52.84l-.05.13v.71C5.82 14.05 22.68 53 26 62.14c.2.62.58 1.8 1.29 1.86h.16c.38 0 2-2.14 2-2.14S58.41 26.74 61.34 23a9.46 9.46 0 0 0 1-1.48 2.41 2.41 0 0 0-.79-2.24zM36.88 23.37L49.24 13.12l7.25 6.68zM32.08 22.7L10.8 5.26l34.43 6.35zM34 27.27l21.78-3.51-24.9 30zM7.91 7L30.3 26 27.06 53.78z" fill="#ef0027"/></svg>`,
      base: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#4d8aff" stroke-width="1.2"/><circle cx="6" cy="6" r="2.2" fill="#4d8aff"/></svg>`,
    };

    return `
      <article class="comp-card" data-id="${comp.id}" role="listitem" tabindex="0"
               aria-label="${comp.type} competition, prize pool ${comp.prizePool} ${comp.currency}">
        <div class="comp-card-header">
          <span class="comp-chain-badge ${comp.chain}">
            <span class="comp-chain-icon">${chainSVG[comp.chain] || ''}</span>
            ${comp.chainLabel}
          </span>
          <span class="comp-status ${comp.status}">
            ${comp.status === 'live' ? '<span class="status-dot" aria-hidden="true"></span>' : ''}
            ${comp.status.toUpperCase()}
          </span>
        </div>

        <div class="comp-type">${comp.type}</div>

        <div class="comp-prize">
          <div class="comp-prize-label">Prize Pool</div>
          <div class="comp-prize-value">${comp.prizePool} <small style="font-size:0.45em;color:var(--accent-cyan);letter-spacing:1px">${comp.currency}</small></div>
        </div>

        <div class="comp-progress-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" aria-label="Competition capacity">
          <div class="comp-progress-fill" style="width:${progress}%"></div>
        </div>

        <div class="comp-participants">
          <span class="comp-player-count">
            <strong>${comp.currentParticipants}</strong><span class="comp-player-max"> / ${comp.maxParticipants}</span> players
          </span>
          <span class="comp-timer" data-timer="${comp.id}">
            ${comp.status === 'ended' ? 'ENDED' : timeStr}
          </span>
        </div>

        <button class="btn btn-secondary btn-sm comp-join-btn" aria-label="View details for ${comp.type}">
          View Details
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
        </button>
      </article>
    `;
  }

  updateCompetitionTimers() {
    if (!window.competitionManager) return;
    for (const comp of window.competitionManager.competitions) {
      const timerEl = document.querySelector(`[data-timer="${comp.id}"]`);
      if (timerEl) {
        timerEl.textContent = comp.status === 'ended'
          ? 'ENDED'
          : window.competitionManager.formatTime(comp.endsIn);
      }
      /* Update status badge if newly ended */
      const card = document.querySelector(`.comp-card[data-id="${comp.id}"]`);
      if (card && comp.status === 'ended') {
        const statusBadge = card.querySelector('.comp-status');
        if (statusBadge && !statusBadge.classList.contains('ended')) {
          statusBadge.className = 'comp-status ended';
          statusBadge.textContent = 'ENDED';
        }
      }
    }
  }

  openCompetitionDetail(compId) {
    const comp = window.competitionManager?.getCompetitionById(compId);
    if (!comp) return;

    const modal = this.compModal;

    /* Chain badge */
    const chainBadge = document.getElementById('modal-chain-badge');
    if (chainBadge) {
      chainBadge.textContent = comp.chainLabel;
      chainBadge.className = `comp-chain-badge comp-detail-chain-badge ${comp.chain}`;
    }

    /* Status badge */
    const statusBadge = document.getElementById('modal-status-badge');
    if (statusBadge) {
      statusBadge.className = `comp-status ${comp.status}`;
      statusBadge.innerHTML = comp.status === 'live'
        ? '<span class="status-dot" aria-hidden="true"></span>Live'
        : comp.status.toUpperCase();
    }

    /* Competition title */
    const titleEl = modal.querySelector('.comp-detail-title');
    if (titleEl) titleEl.textContent = comp.type;

    /* Prize, fee, players */
    const prizeEl = document.getElementById('modal-prize-value');
    if (prizeEl) prizeEl.textContent = `${comp.prizePool} ${comp.currency}`;

    const feeEl = document.getElementById('modal-entry-fee');
    if (feeEl) feeEl.textContent = `${comp.entryFee} ${comp.currency}`;

    const playersEl = document.getElementById('modal-players');
    if (playersEl) playersEl.textContent = `${comp.currentParticipants}/${comp.maxParticipants}`;

    /* Description */
    const descEl = document.getElementById('modal-description');
    if (descEl) descEl.textContent = comp.description;

    /* Participants */
    const partList = document.getElementById('modal-participants');
    if (partList) {
      partList.innerHTML = comp.participants.slice(0, 5).map(p => `
        <div class="participant-item">
          <span class="participant-addr">${p.address}</span>
          <span class="participant-time">${p.entries} ${p.entries > 1 ? 'entries' : 'entry'}</span>
        </div>
      `).join('');
    }

    /* Enter button */
    const enterBtn = document.getElementById('comp-enter-btn');
    if (enterBtn) {
      if (comp.status === 'ended') {
        enterBtn.textContent = comp.winner ? `Winner: ${comp.winner}` : 'Competition Ended';
        enterBtn.disabled = true;
        enterBtn.className = 'btn btn-secondary btn-lg comp-enter-btn';
      } else {
        const label = `Enter for ${comp.entryFee} ${comp.currency}`;
        enterBtn.textContent = window.wallet?.connected ? label : 'Connect Wallet to Enter';
        enterBtn.setAttribute('data-enter-text', label);
        enterBtn.disabled = !window.wallet?.connected;
        enterBtn.className = 'btn btn-primary btn-lg comp-enter-btn';
        enterBtn.onclick = () => {
          if (window.competitionManager.enterCompetition(compId)) {
            this.showToast('success', `Entered ${comp.type}! Good luck!`);
            this.renderCompetitions();
            this.closeModal(this.compModal);
          } else {
            this.showToast('error', 'Competition is full or has ended.');
          }
        };
      }
    }

    this.openModal(modal);
  }

  /* ══════════════════════════════════════
     LOOT BOX RENDERING
  ══════════════════════════════════════ */
  renderLootBoxes() {
    if (!this.lootboxGrid || !window.lootBoxManager) return;

    const tierIcons = { bronze: '📦', silver: '📫', gold: '🪙', diamond: '💎' };
    const tierGradients = {
      bronze:  'var(--gradient-bronze)',
      silver:  'var(--gradient-silver)',
      gold:    'var(--gradient-gold)',
      diamond: 'var(--gradient-diamond)',
    };

    this.lootboxGrid.innerHTML = window.lootBoxManager.boxes.map(box => `
      <article class="lootbox-card ${box.id}" data-box="${box.id}" role="listitem"
               tabindex="0" aria-label="${box.tier} loot box, price ${box.price} ${box.currency}">

        <div class="lootbox-visual">
          <div class="lootbox-icon-bg"></div>
          <div class="lootbox-icon" aria-hidden="true">${tierIcons[box.id] || '📦'}</div>
        </div>

        <div class="lootbox-name">${box.tier}</div>
        <div class="lootbox-range">Win up to <strong>${box.maxReward} ${box.currency}</strong></div>

        <div class="lootbox-items" aria-label="Possible rewards">
          ${Object.entries(box.rarities).slice(0, 3).map(([key, r]) => `
            <div class="lootbox-item-row">
              <span>${r.label}</span>
              <span style="color:var(--text-muted)">${Math.round(r.chance * 100)}%</span>
            </div>
          `).join('')}
        </div>

        <div class="lootbox-price">${box.price} <small style="font-size:0.6em;color:var(--text-muted)">${box.currency}</small></div>

        <button class="btn btn-primary lootbox-open-btn" data-box="${box.id}"
                aria-label="Open ${box.tier} loot box for ${box.price} ${box.currency}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="2" y="7" width="12" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
            <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          Open Box
        </button>
      </article>
    `).join('');

    /* Bind open events */
    this.lootboxGrid.querySelectorAll('.lootbox-open-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openLootBox(btn.dataset.box);
      });
    });

    /* Card click also opens */
    this.lootboxGrid.querySelectorAll('.lootbox-card').forEach(card => {
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openLootBox(card.dataset.box);
        }
      });
    });
  }

  async openLootBox(boxId) {
    if (!window.wallet?.connected) {
      this.showToast('error', 'Connect your wallet first!');
      this.openModal(this.walletModal);
      return;
    }

    if (window.lootBoxManager?.isOpening) return;

    const result = await window.lootBoxManager?.openBox(boxId);
    if (!result) return;

    const modal = this.lootboxModal;
    const boxEl       = modal.querySelector('.lootbox-opening-box');
    const resultEl    = modal.querySelector('.lootbox-result');
    const statusEl    = modal.querySelector('.lootbox-opening-status');
    const glowRing    = modal.querySelector('.lootbox-glow-ring');

    /* Reset state */
    if (boxEl) {
      boxEl.classList.remove('shaking', 'opening');
      boxEl.style.display = 'flex';
    }
    if (resultEl) resultEl.classList.remove('visible');
    if (statusEl) statusEl.textContent = 'Initializing...';

    this.openModal(modal);

    /* Phase 1 — shake (300ms → 2000ms) */
    setTimeout(() => {
      boxEl?.classList.add('shaking');
      if (statusEl) statusEl.textContent = 'Rolling rarity on-chain...';
      if (glowRing) glowRing.style.animationDuration = '0.8s';
    }, 300);

    /* Phase 2 — open (2000ms) */
    setTimeout(() => {
      boxEl?.classList.remove('shaking');
      boxEl?.classList.add('opening');
      if (statusEl) statusEl.textContent = 'Opening...';
    }, 2000);

    /* Phase 3 — reveal (2700ms) */
    setTimeout(() => {
      if (boxEl) boxEl.style.display = 'none';
      if (statusEl) statusEl.textContent = '';

      /* Populate result */
      const amountEl  = document.getElementById('result-amount');
      const rarityEl  = document.getElementById('result-rarity');

      if (amountEl) amountEl.textContent = `${result.reward} ${result.currency}`;
      if (rarityEl) {
        rarityEl.textContent = result.rarity.label;
        rarityEl.className = `result-rarity-badge rarity-${result.rarity.key}`;
      }

      const labelEl = modal.querySelector('.lootbox-result-label');
      if (labelEl) {
        labelEl.textContent = result.isJackpot
          ? 'JACKPOT!'
          : result.isWin
          ? 'You Won!'
          : 'Better luck next time';
      }

      if (resultEl) resultEl.classList.add('visible');

      /* Confetti for legendary/epic wins */
      if (result.isWin || result.isJackpot) {
        this.createPremiumConfetti();
      }

      window.lootBoxManager?.finishOpening();
    }, 2700);
  }

  /* ── Premium confetti — design-spell ── */
  createPremiumConfetti() {
    const colors = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#a78bfa'];
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const color = colors[Math.floor(Math.random() * colors.length)];
      piece.style.cssText = `
        left:       ${Math.random() * 100}%;
        background: ${color};
        width:      ${Math.random() * 8 + 4}px;
        height:     ${Math.random() * 8 + 4}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${Math.random() * 2 + 2}s;
        animation-delay:    ${Math.random() * 0.6}s;
      `;
      this.confettiContainer?.appendChild(piece);
      setTimeout(() => piece.remove(), 4000);
    }
  }

  /* ══════════════════════════════════════
     LEADERBOARD
  ══════════════════════════════════════ */
  renderLeaderboard() {
    if (!this.leaderboardBody) return;

    const rankMeta = [
      { cls: 'gold',   medal: '① ' },
      { cls: 'silver', medal: '② ' },
      { cls: 'bronze', medal: '③ ' },
    ];

    this.leaderboardBody.innerHTML = this._lbData.map((p, i) => {
      const rm = rankMeta[i] || { cls: 'other', medal: '' };
      const rateColor = p.winRate >= 60
        ? 'var(--accent-green)'
        : p.winRate >= 45
        ? 'var(--accent-gold)'
        : 'var(--text-muted)';

      return `
        <tr>
          <td><span class="lb-rank ${rm.cls}">${rm.medal}#${i + 1}</span></td>
          <td><span class="lb-wallet">${p.wallet}</span></td>
          <td><span class="lb-wins">${p.wins}</span></td>
          <td><span class="lb-earned">${p.earned} ETH</span></td>
          <td><span class="lb-rate" style="color:${rateColor}">${p.winRate}%</span></td>
        </tr>
      `;
    }).join('');
  }

  generateLeaderboardData() {
    const wallets = [
      '0x7aB3...f2D1', '0x1cE9...a3B7', '0xdF42...9e1C', '0x8bA1...4dF5',
      '0x3eC7...b8A2', '4nKz8...QmRt', '0x5fD8...c1E3', '7tRxP...3mWp',
      '0x9aE6...2bD4', '0x2dB5...7aC9',
    ];
    return wallets.map(wallet => ({
      wallet,
      wins:    Math.floor(Math.random() * 50) + 5,
      earned:  (Math.random() * 30 + 1).toFixed(2),
      winRate: Math.floor(Math.random() * 45) + 30,
    })).sort((a, b) => parseFloat(b.earned) - parseFloat(a.earned));
  }

  setupLeaderboardTabs() {
    document.querySelectorAll('.lb-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.lb-tab').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        /* Re-shuffle data to simulate period change */
        this._lbData = this.generateLeaderboardData();
        this.renderLeaderboard();
      });
    });
  }

  /* ══════════════════════════════════════
     ANIMATED COUNTERS — easeOutCubic
  ══════════════════════════════════════ */
  startAnimatedCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el       = entry.target;
        const target   = parseFloat(el.dataset.countTo);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const duration = 2200;
        let startTime  = null;

        const animate = (ts) => {
          if (!startTime) startTime = ts;
          const pct    = Math.min((ts - startTime) / duration, 1);
          const eased  = 1 - Math.pow(1 - pct, 3);
          el.textContent = (eased * target).toFixed(decimals);
          if (pct < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
  }

  /* ══════════════════════════════════════
     SCROLL REVEAL — staggered entries
  ══════════════════════════════════════ */
  setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

    document.querySelectorAll('.reveal').forEach(el => {
      /* Immediately reveal elements already in viewport */
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      } else {
        observer.observe(el);
      }
    });
  }

  /* ══════════════════════════════════════
     MAGNETIC BUTTONS — design-spell physics
  ══════════════════════════════════════ */
  setupMagneticButtons() {
    /* Apply magnetic hover to primary hero buttons */
    document.querySelectorAll('.hero-cta-primary, .btn-wallet').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx   = rect.left + rect.width / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) * 0.25;
        const dy   = (e.clientY - cy) * 0.25;
        btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ══════════════════════════════════════
     MODAL MANAGEMENT
  ══════════════════════════════════════ */
  setupModalCloseHandlers() {
    /* Named close buttons */
    const closeMap = {
      'wallet-modal-close': this.walletModal,
      'comp-modal-close':   this.compModal,
      'loot-modal-close':   this.lootboxModal,
      'loot-collect-btn':   this.lootboxModal,
    };

    Object.entries(closeMap).forEach(([id, modal]) => {
      document.getElementById(id)?.addEventListener('click', () => {
        this.closeModal(modal);
        if (modal === this.lootboxModal) {
          window.lootBoxManager?.finishOpening();
        }
      });
    });

    /* Overlay click to dismiss */
    [this.walletModal, this.compModal, this.lootboxModal].forEach(modal => {
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
          if (modal === this.lootboxModal) window.lootBoxManager?.finishOpening();
        }
      });
    });

    /* Escape key */
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      [this.walletModal, this.compModal, this.lootboxModal].forEach(modal => {
        if (modal?.classList.contains('active')) {
          this.closeModal(modal);
          if (modal === this.lootboxModal) window.lootBoxManager?.finishOpening();
        }
      });
    });
  }

  openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ══════════════════════════════════════
     TOAST NOTIFICATIONS — premium SVG icons
  ══════════════════════════════════════ */
  showToast(type, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const iconSVGs = {
      success: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.2"/><path d="M6 9l2 2 4-4" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      error:   `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" fill="rgba(239,68,68,0.15)" stroke="#ef4444" stroke-width="1.2"/><path d="M6.5 6.5l5 5M11.5 6.5l-5 5" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      info:    `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" fill="rgba(124,58,237,0.15)" stroke="#a78bfa" stroke-width="1.2"/><path d="M9 8v5M9 6h.01" stroke="#a78bfa" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      warning: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L16.5 15H1.5L9 2z" fill="rgba(245,158,11,0.15)" stroke="#f59e0b" stroke-width="1.2" stroke-linejoin="round"/><path d="M9 8v3M9 13h.01" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${iconSVGs[type] || iconSVGs.info}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);

    const remove = () => {
      toast.classList.add('removing');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    /* Auto-dismiss after 3.5s */
    const timer = setTimeout(remove, 3500);
    toast.addEventListener('click', () => { clearTimeout(timer); remove(); });
  }

  /* ══════════════════════════════════════════════════════
     TOURNAMENT SYSTEM — Calculator + Grid + Modal
  ══════════════════════════════════════════════════════ */
  setupTournaments() {
    const tm = window.tournamentManager;
    if (!tm) return;

    /* ── State ── */
    let _mode  = '1v1';
    let _coin  = 'ETH';
    let _entry = 1;
    let _tournFilter = 'all';

    /* ── DOM refs ── */
    const modeButtons  = document.querySelectorAll('.tourn-mode-btn');
    const coinButtons  = document.querySelectorAll('.tourn-coin-btn');
    const entryInput   = document.getElementById('tourn-entry-input');
    const coinLabel    = document.getElementById('entry-coin-label');
    const quickAmts    = document.querySelectorAll('.quick-amt');
    const filterBtns   = document.querySelectorAll('.tourn-filter-btn');
    const grid         = document.getElementById('tournaments-grid');
    const modal        = document.getElementById('tournament-modal');

    /* ── Payout display refs ── */
    const elPot      = document.getElementById('payout-total-pot');
    const elGross    = document.getElementById('payout-gross');
    const elFee      = document.getElementById('payout-fee');
    const elNet      = document.getElementById('payout-net');
    const elPlatform = document.getElementById('payout-platform');
    const elMeta     = document.getElementById('payout-meta-text');

    /* ─────────────────────────────
       Update calculator display
    ───────────────────────────── */
    const updateCalc = () => {
      const p = tm.calculatePayout(_mode, _coin, _entry);
      if (!p) return;
      const f = (n) => tm.fmt(n, _coin);
      const c = _coin;

      elPot.textContent      = `${f(p.totalPot)} ${c}`;
      elGross.textContent    = `${f(p.grossPerWinner)} ${c}`;
      elFee.textContent      = `-${f(p.fee)} ${c}`;
      elNet.textContent      = `${f(p.netPayout)} ${c}`;
      elPlatform.textContent = `${f(p.platformIncome)} ${c}`;
      elMeta.textContent     = `${p.winnerTeamSize} kazanan · ${p.players} toplam oyuncu · %5 fee kârdan`;

      /* Animate net value for impact */
      elNet.style.transform = 'scale(1.05)';
      setTimeout(() => { elNet.style.transform = 'scale(1)'; }, 200);
    };

    /* ─────────────────────────────
       Mode selector
    ───────────────────────────── */
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        _mode = btn.dataset.mode;
        modeButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-checked', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        updateCalc();
      });
    });

    /* ─────────────────────────────
       Coin selector
    ───────────────────────────── */
    coinButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        _coin = btn.dataset.coin;
        coinButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-checked', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        coinLabel.textContent = _coin;
        /* Reset entry to sane default */
        const defaults = { ETH: 1, SOL: 5, AVAX: 10, BNB: 1, TRX: 1000 };
        _entry = defaults[_coin] || 1;
        entryInput.value = _entry;
        /* Reset quick amount buttons */
        quickAmts.forEach(a => a.classList.remove('active'));
        updateCalc();
      });
    });

    /* ─────────────────────────────
       Entry amount input
    ───────────────────────────── */
    entryInput.addEventListener('input', () => {
      const val = parseFloat(entryInput.value);
      if (!isNaN(val) && val > 0) {
        _entry = val;
        quickAmts.forEach(a => {
          a.classList.toggle('active', parseFloat(a.dataset.amount) === val);
        });
        updateCalc();
      }
    });

    /* ─────────────────────────────
       Quick-amount buttons
    ───────────────────────────── */
    quickAmts.forEach(btn => {
      btn.addEventListener('click', () => {
        _entry = parseFloat(btn.dataset.amount);
        entryInput.value = _entry;
        quickAmts.forEach(a => a.classList.remove('active'));
        btn.classList.add('active');
        updateCalc();
      });
    });

    /* ─────────────────────────────
       Tournament grid rendering
    ───────────────────────────── */
    const renderTournamentGrid = (filter = 'all') => {
      if (!grid) return;
      const list = tm.getFiltered(filter);

      const modeColors = { '1v1': 'var(--accent-purple)', '2v2': 'var(--accent-cyan)', '4v4': 'var(--accent-gold)' };
      const coinColors = { ETH: '#627eea', SOL: '#9945ff', AVAX: '#e84142', BNB: '#f3ba2f', TRX: '#ef0027' };
      const statusMap  = { open: 'Açık', filling: 'Dolmakta', live: 'Canlı' };

      const coinSVG = (coin) => ({
        ETH:  `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l3 4.3L6 6.5 3 5.3 6 1z" fill="#627eea" opacity=".9"/><path d="M6 7.5l3-1.2L6 11 3 6.3 6 7.5z" fill="#627eea"/></svg>`,
        SOL:  `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 3.5h8L8 5H3L1.5 3.5zM1.5 6.5h7l1.5 1.5H3L1.5 6.5z" fill="#9945ff"/></svg>`,
        AVAX: `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2L10 9.5H2L6 2z" stroke="#e84142" stroke-width="1" fill="rgba(232,65,66,0.15)"/></svg>`,
        BNB:  `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="6" y="1.5" width="3" height="3" transform="rotate(45 6 1.5)" fill="#f3ba2f"/><rect x="6" y="7.5" width="3" height="3" transform="rotate(45 6 7.5)" fill="#f3ba2f"/></svg>`,
        TRX:  `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 1.5l9 4.5-4 1L2 10.5V1.5z" fill="#ef0027" opacity=".8"/></svg>`,
      })[coin] || '';

      grid.innerHTML = list.map(t => {
        const p       = t.payout;
        const filled  = Math.round((t.currentJoined / t.maxPlayers) * 100);
        const mc      = modeColors[t.mode] || 'var(--accent-purple)';
        const cc      = coinColors[t.coin] || '#fff';
        const stLabel = statusMap[t.status] || t.status;
        const timerStr = t.status !== 'live' ? `${t.currentJoined}/${t.maxPlayers} oyuncu` : `CANLI`;

        return `
          <article class="tourn-card" data-tourn-id="${t.id}" data-tourn-mode="${t.mode}" role="listitem"
                   tabindex="0" aria-label="${t.modeLabel} turnuvası, giriş ${p.entryAmount} ${t.coin}">

            <div class="tourn-card-top">
              <div class="tourn-mode-pill" style="--mode-color:${mc}">${t.modeLabel}</div>
              <span class="comp-status ${t.status}">
                ${t.status === 'live' ? '<span class="status-dot" aria-hidden="true"></span>' : ''}
                ${stLabel}
              </span>
            </div>

            <div class="tourn-card-id">${t.id}</div>

            <!-- Vs visual -->
            <div class="tourn-vs-visual">
              ${Array.from({length: t.payout.players}, (_, i) => `
                <div class="tourn-avatar-chip" style="--delay:${i * 60}ms"
                     aria-hidden="true">${i + 1}</div>
              `).join('')}
              <span class="tourn-vs-badge">VS</span>
            </div>

            <div class="tourn-card-prize">
              <div class="tourn-prize-label">Net Ödeme (kazanana)</div>
              <div class="tourn-prize-value">
                ${coinSVG(t.coin)}
                ${tm.fmt(p.netPayout, t.coin)}
                <small style="font-size:0.45em;color:${cc};letter-spacing:1px">${t.coin}</small>
              </div>
              <div class="tourn-prize-sub">
                Giriş: ${tm.fmt(p.entryAmount, t.coin)} ${t.coin} · Pot: ${tm.fmt(p.totalPot, t.coin)}
              </div>
            </div>

            <div class="tourn-capacity-bar" role="progressbar"
                 aria-valuenow="${filled}" aria-valuemin="0" aria-valuemax="100"
                 aria-label="Kapasite ${filled}%">
              <div class="tourn-capacity-fill" style="width:${filled}%"></div>
            </div>
            <div class="tourn-capacity-label">${t.currentJoined} / ${t.maxPlayers} oyuncu · ${timerStr}</div>

            <button class="btn btn-secondary btn-sm tourn-join-card-btn"
                    aria-label="Turnuvaya Katıl">
              Katıl
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M4 3l4 3.5-4 3.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
            </button>
          </article>
        `;
      }).join('');

      /* Card click → open modal */
      grid.querySelectorAll('.tourn-join-card-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const card = e.target.closest('.tourn-card');
          const id   = card?.dataset.tournId;
          if (id) this.openTournamentModal(id);
        });
      });

      /* Keyboard support */
      grid.querySelectorAll('.tourn-card').forEach(card => {
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openTournamentModal(card.dataset.tournId);
          }
        });
      });
    };

    /* ─────────────────────────────
       Grid filter buttons
    ───────────────────────────── */
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        _tournFilter = btn.dataset.tournFilter;
        filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        renderTournamentGrid(_tournFilter);
      });
    });

    /* ─────────────────────────────
       Modal close handlers
    ───────────────────────────── */
    const closeModal = () => {
      modal?.classList.remove('active');
      modal?.removeAttribute('aria-modal');
      document.body.style.overflow = '';
    };

    document.getElementById('tourn-modal-close')?.addEventListener('click', closeModal);
    document.getElementById('tourn-modal-cancel')?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    /* Join button */
    document.getElementById('tourn-join-btn')?.addEventListener('click', () => {
      closeModal();
      this.showToast('Turnuvaya katılma isteği gönderildi! Cüzdan bağlantısı bekleniyor.', 'info');
    });

    /* ─────────────────────────────
       Initial render
    ───────────────────────────── */
    updateCalc();
    renderTournamentGrid('all');
  }

  /* ── Open tournament modal ── */
  openTournamentModal(id) {
    const tm = window.tournamentManager;
    const t  = tm?.getTournamentById(id);
    if (!t) return;

    const p   = t.payout;
    const f   = (n) => tm.fmt(n, t.coin);
    const m   = document.getElementById('tournament-modal');
    if (!m) return;

    document.getElementById('tourn-modal-mode-badge').textContent  = t.modeLabel;
    document.getElementById('tourn-modal-title').textContent       = `${t.id} — ${t.modeLabel} Turnuvası`;
    document.getElementById('tourn-modal-pot').textContent         = `${f(p.totalPot)} ${t.coin}`;
    document.getElementById('tourn-modal-net').textContent         = `${f(p.netPayout)} ${t.coin}`;
    document.getElementById('tourn-modal-entry').textContent       = `${f(p.entryAmount)} ${t.coin}`;
    document.getElementById('tourn-modal-mode-text').textContent   = `${t.modeLabel} (${t.mode})`;
    document.getElementById('tourn-modal-coin').textContent        = t.coin;
    document.getElementById('tourn-modal-players').textContent     = `${t.currentJoined} / ${t.maxPlayers}`;
    document.getElementById('tourn-modal-fee-text').textContent    =
      `Kâr: ${f(p.profit)} ${t.coin} → %5 Fee: ${f(p.fee)} ${t.coin} → Net: ${f(p.netPayout)} ${t.coin}`;

    m.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('tourn-modal-close')?.focus();
  }

  /* ══════════════════════════════════════════════════════
     HERO VIDEO PRELOADER — Load once to memory (Blob URL)
     Ensures smooth loop and no repeated network requests.
     ══════════════════════════════════════════════════════ */
  async preloadHeroVideo() {
    const video = document.querySelector('.hero-video-bg');
    if (!video) return;

    // Use the primary source from index.html
    const videoSrc = video.querySelector('source')?.src || "https://res.cloudinary.com/metarush/video/upload/hero_bg.mp4";

    try {
      const response = await fetch(videoSrc);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      // Apply the local Blob URL to the video element
      video.src = blobUrl;
      video.load();
      video.play().catch(e => console.warn("Auto-play blocked, waiting for interaction."));

      console.log("Hero video preloaded into memory successfully.");
    } catch (error) {
      console.error("Video preloading failed:", error);
      // Fallback: the video will still try to load via native src if preloading fails
    }
  }




}
