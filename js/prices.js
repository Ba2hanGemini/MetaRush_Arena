/**
 * PriceManager Class
 * Handles real-time cryptocurrency prices from Binance API
 */
class PriceManager {
    constructor() {
        this.symbols = ["ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT", "AVAXUSDT", "TRXUSDT"];
        this.prices = {};
        this.updateInterval = 10000; // 10 seconds
        this.isDropdownOpen = false;
        
        this.init();
    }

    async init() {
        this.createElements();
        this.bindEvents();
        await this.fetchPrices();
        this.startAutoUpdate();
    }

    createElements() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const tickerContainer = document.createElement('div');
        tickerContainer.className = 'price-ticker';
        tickerContainer.innerHTML = `
            <div class="price-ticker-pill" id="tickerPill">
                <div class="ticker-icon">⚡</div>
                <div class="ticker-label">ETH/USDT</div>
                <div class="ticker-value" id="mainPrice">Loading...</div>
                <div class="ticker-arrow">▼</div>
            </div>
            <div class="price-dropdown" id="priceDropdown">
                ${this.symbols.map(s => `
                    <div class="price-item" data-symbol="${s}">
                        <div class="item-left">
                            <div class="item-symbol">${s.replace('USDT', '')}</div>
                        </div>
                        <div class="item-price" id="price-${s}">---</div>
                    </div>
                `).join('')}
            </div>
        `;

        hero.appendChild(tickerContainer);
        
        this.pill = document.getElementById('tickerPill');
        this.dropdown = document.getElementById('priceDropdown');
        this.mainPriceDisplay = document.getElementById('mainPrice');
    }

    bindEvents() {
        if (!this.pill) return;

        this.pill.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        document.addEventListener('click', () => {
            if (this.isDropdownOpen) this.toggleDropdown();
        });
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
        this.pill.classList.toggle('active', this.isDropdownOpen);
        this.dropdown.classList.toggle('show', this.isDropdownOpen);
    }

    async fetchPrices() {
        try {
            const symbolsParam = JSON.stringify(this.symbols);
            const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${symbolsParam}`);
            const data = await response.json();

            data.forEach(item => {
                const price = parseFloat(item.price);
                const formattedPrice = price < 1 ? price.toFixed(4) : price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                
                this.prices[item.symbol] = formattedPrice;
                
                // Update UI
                const itemEl = document.getElementById(`price-${item.symbol}`);
                if (itemEl) {
                    itemEl.textContent = `$${formattedPrice}`;
                    itemEl.classList.add('updating');
                    setTimeout(() => itemEl.classList.remove('updating'), 500);
                }

                // Update main display if it's ETH
                if (item.symbol === 'ETHUSDT') {
                    this.mainPriceDisplay.textContent = `$${formattedPrice}`;
                }
            });
        } catch (error) {
            console.error('Price fetch error:', error);
            if (this.mainPriceDisplay) this.mainPriceDisplay.textContent = "Offline";
        }
    }

    startAutoUpdate() {
        setInterval(() => this.fetchPrices(), this.updateInterval);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.priceManager = new PriceManager();
});
