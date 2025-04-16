import * as ccxt from 'ccxt';

// Simple test to check if ccxt is working
console.log('CCXT Version:', ccxt.version);
console.log('Supported Exchanges:', Object.keys(ccxt.exchanges).length);
console.log('First 5 exchanges:', Object.keys(ccxt.exchanges).slice(0, 5));

// Original ticker fetching functionality
const symbol = 'BTC/USD';
const exchanges = ['coinbase', 'kraken', 'binance']; // Updated exchange list

const fetchTickers = async (symbol: string) => {
    try {
        console.log(`\nFetching ${symbol} data from: ${exchanges.join(', ')}...`);
        
        for (const id of exchanges) {
            try {
                console.log(`\nTrying exchange: ${id}`);
                const exchangeId = id as keyof typeof ccxt;
                
                // Check if exchange exists
                if (!ccxt[exchangeId]) {
                    console.error(`Exchange ${id} not found in ccxt`);
                    continue;
                }
                
                // @ts-ignore - Ignore type errors for demonstration
                const exchange = new ccxt[exchangeId]({ 
                    'enableRateLimit': true 
                });
                
                console.log('Exchange initialized');
                console.log('Has fetchTicker:', typeof exchange.fetchTicker === 'function');
                
                if (typeof exchange.fetchTicker === 'function') {
                    console.log(`Fetching ticker for ${symbol}...`);
                    const ticker = await exchange.fetchTicker(symbol);
                    console.log('Ticker result:', ticker);
                } else {
                    console.log(`Exchange ${id} does not support fetchTicker`);
                }
            } catch (err: any) {
                console.error(`Error with ${id}:`, err.message);
            }
        }
    } catch (err: any) {
        console.error('Top-level error:', err.message);
    }
};

// Run the fetch function
fetchTickers(symbol)
    .then(() => console.log('\nFetch completed'))
    .catch(err => console.error('Unhandled error:', err)); 