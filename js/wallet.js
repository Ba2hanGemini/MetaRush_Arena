/* ========================================
   METARUSH — Wallet Simulation
   Simulated Web3 wallet connect flow
   ======================================== */

class WalletManager {
  constructor() {
    this.connected = false;
    this.address = null;
    this.balance = 0;
    this.chain = null;
    this.walletType = null;

    this.onConnect = null;
    this.onDisconnect = null;
  }

  generateAddress(type) {
    const chars = '0123456789abcdef';
    let addr = '';
    if (type === 'phantom') {
      // Solana-style address (base58)
      const b58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      for (let i = 0; i < 44; i++) addr += b58[Math.floor(Math.random() * b58.length)];
      return addr;
    }
    // Ethereum-style address
    for (let i = 0; i < 40; i++) addr += chars[Math.floor(Math.random() * chars.length)];
    return '0x' + addr;
  }

  shortenAddress(address) {
    if (!address) return '';
    if (address.startsWith('0x')) {
      return address.slice(0, 6) + '...' + address.slice(-4);
    }
    return address.slice(0, 4) + '...' + address.slice(-4);
  }

  generateBalance(type) {
    if (type === 'phantom') {
      return (Math.random() * 50 + 5).toFixed(2); // SOL
    }
    return (Math.random() * 5 + 0.5).toFixed(4); // ETH
  }

  async connect(walletType) {
    return new Promise((resolve) => {
      this.walletType = walletType;

      // Simulate connection delay
      setTimeout(() => {
        if (walletType === 'phantom') {
          this.chain = 'SOL';
          this.address = this.generateAddress('phantom');
          this.balance = this.generateBalance('phantom');
        } else {
          this.chain = 'ETH';
          this.address = this.generateAddress('eth');
          this.balance = this.generateBalance('eth');
        }

        this.connected = true;

        if (this.onConnect) {
          this.onConnect({
            address: this.address,
            shortAddress: this.shortenAddress(this.address),
            balance: this.balance,
            chain: this.chain,
            walletType: this.walletType,
          });
        }

        resolve(true);
      }, 1500 + Math.random() * 1000);
    });
  }

  disconnect() {
    this.connected = false;
    this.address = null;
    this.balance = 0;
    this.chain = null;
    this.walletType = null;

    if (this.onDisconnect) {
      this.onDisconnect();
    }
  }

  getCurrencySymbol() {
    return this.chain === 'SOL' ? 'SOL' : 'ETH';
  }

  getChainIcon() {
    return this.chain === 'SOL' ? '◎' : 'Ξ';
  }
}

// Global wallet instance
window.wallet = new WalletManager();
