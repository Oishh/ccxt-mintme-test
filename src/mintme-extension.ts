import * as ccxt from 'ccxt';
import axios, { AxiosError } from 'axios';

// Declare the module augmentation to add mintme to ccxt
declare module 'ccxt' {
    export const mintme: typeof MintMeExchange;
}

// Define interfaces for API responses
interface MintMeMarket {
    id: string;
    symbol: string;
    base: string;
    quote: string;
}

// Extend the CCXT base Exchange class to create a custom MintMe exchange implementation
class MintMeExchange extends ccxt.Exchange {
    // Define the exchange ID and name
    id = 'mintme';
    name = 'MintMe';
    
    // Define the API urls
    urls: {
        api: { public: string; private: string };
        www: string;
        doc: string[];
    } = {
        'api': {
            'public': 'https://www.mintme.com/dev/api/v2',
            'private': 'https://www.mintme.com/dev/api/v2',
        },
        'www': 'https://www.mintme.com',
        'doc': ['https://mintme.com/docs/api'], // Changed to array to match base type
    };
    
    // Define API methods and their endpoints
    api = {
        'public': {
            'get': [
                'open/assets', // Get all assets
            ],
        },
        'private': {
            'post': [
                'balances', // Get account balances
                'orders', // Get open orders
                'orders/{pair}', // Place order
                'order/{id}', // Get order info
                'cancel/{id}', // Cancel order
            ],
        },
    };
    
    // Define available markets/pairs (to be populated during loadMarkets)
    markets: Record<string, ccxt.Market> = {};
    
    constructor(config = {}) {
        super({ 
            // Default config for the exchange
            'enableRateLimit': true,
            'rateLimit': 1000, // 1 request per second
            ...config,
        });
    }
    
    // Method to load markets/pairs available on the exchange
    async loadMarkets(reload?: boolean, params = {}): Promise<ccxt.Dictionary<ccxt.Market>> {
        // In a real implementation, you would fetch the markets from the API
        // For this example, we'll define some common pairs manually
        const defaultMarketProps = {
            'active': true,
            'spot': true,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'contract': false,
            'linear': false,
            'inverse': false,
            'taker': 0.002,
            'maker': 0.002,
            'contractSize': 1,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'tierBased': false,
            'percentage': true,
            'feeSide': 'get' as const,
            'settle': undefined,
            'settleId': undefined,
            'created': Date.now(),
        };

        const markets: ccxt.Dictionary<ccxt.Market> = {
            'BTC/WETH': { 
                'id': 'btc-weth', 
                'symbol': 'BTC/WETH', 
                'base': 'BTC', 
                'quote': 'WETH',
                'baseId': 'btc',
                'quoteId': 'weth',
                'type': 'spot',
                'precision': {
                    'amount': 8,
                    'price': 8
                },
                'limits': {
                    'amount': {
                        'min': 0.0001,
                        'max': undefined
                    },
                    'price': {
                        'min': 0.00000001,
                        'max': undefined
                    },
                    'cost': {
                        'min': 0.0001,
                        'max': undefined
                    }
                },
                'info': {},
                ...defaultMarketProps
            },
            'ETH/WETH': { 
                'id': 'eth-weth', 
                'symbol': 'ETH/WETH', 
                'base': 'ETH', 
                'quote': 'WETH',
                'baseId': 'eth',
                'quoteId': 'weth',
                'type': 'spot',
                'precision': {
                    'amount': 8,
                    'price': 8
                },
                'limits': {
                    'amount': {
                        'min': 0.0001,
                        'max': undefined
                    },
                    'price': {
                        'min': 0.00000001,
                        'max': undefined
                    },
                    'cost': {
                        'min': 0.0001,
                        'max': undefined
                    }
                },
                'info': {},
                ...defaultMarketProps
            },
            'MINTME/BTC': { 
                'id': 'mintme-btc', 
                'symbol': 'MINTME/BTC', 
                'base': 'MINTME', 
                'quote': 'BTC',
                'baseId': 'mintme',
                'quoteId': 'btc',
                'type': 'spot',
                'precision': {
                    'amount': 8,
                    'price': 8
                },
                'limits': {
                    'amount': {
                        'min': 0.0001,
                        'max': undefined
                    },
                    'price': {
                        'min': 0.00000001,
                        'max': undefined
                    },
                    'cost': {
                        'min': 0.0001,
                        'max': undefined
                    }
                },
                'info': {},
                ...defaultMarketProps
            },
            'MINTME/ETH': { 
                'id': 'mintme-eth', 
                'symbol': 'MINTME/ETH', 
                'base': 'MINTME', 
                'quote': 'ETH',
                'baseId': 'mintme',
                'quoteId': 'eth',
                'type': 'spot',
                'precision': {
                    'amount': 8,
                    'price': 8
                },
                'limits': {
                    'amount': {
                        'min': 0.0001,
                        'max': undefined
                    },
                    'price': {
                        'min': 0.00000001,
                        'max': undefined
                    },
                    'cost': {
                        'min': 0.0001,
                        'max': undefined
                    }
                },
                'info': {},
                ...defaultMarketProps
            },
            'BTC/USD': { 
                'id': 'btc-usd', 
                'symbol': 'BTC/USD', 
                'base': 'BTC', 
                'quote': 'USD',
                'baseId': 'btc',
                'quoteId': 'usd',
                'type': 'spot',
                'precision': {
                    'amount': 8,
                    'price': 2
                },
                'limits': {
                    'amount': {
                        'min': 0.0001,
                        'max': undefined
                    },
                    'price': {
                        'min': 0.01,
                        'max': undefined
                    },
                    'cost': {
                        'min': 0.01,
                        'max': undefined
                    }
                },
                'info': {},
                ...defaultMarketProps
            },
            'ETH/USD': { 
                'id': 'eth-usd', 
                'symbol': 'ETH/USD', 
                'base': 'ETH', 
                'quote': 'USD',
                'baseId': 'eth',
                'quoteId': 'usd',
                'type': 'spot',
                'precision': {
                    'amount': 8,
                    'price': 2
                },
                'limits': {
                    'amount': {
                        'min': 0.0001,
                        'max': undefined
                    },
                    'price': {
                        'min': 0.01,
                        'max': undefined
                    },
                    'cost': {
                        'min': 0.01,
                        'max': undefined
                    }
                },
                'info': {},
                ...defaultMarketProps
            },
        };
        
        this.markets = markets;
        return this.markets;
    }
    
    // Method to fetch assets from the API
    async fetchAssets(params = {}): Promise<any> {
        try {
            // Make the API request to get assets information
            const response = await axios.get(`${this.urls.api.public}/open/assets`);
            
            // Check if the request was successful
            if (response.status !== 200) {
                throw new Error(`MintMe API error: ${response.statusText}`);
            }
            
            return response.data;
        } catch (error) {
            // Handle API errors
            if (error instanceof AxiosError && error.response) {
                throw new Error(`MintMe API error: ${error.response.status} ${error.response.statusText}`);
            } else {
                throw error;
            }
        }
    }
}

// Add MintMe to the CCXT exchanges
(ccxt as any).mintme = MintMeExchange;

// Example usage
export async function fetchMintMeAssets() {
    try {
        const mintme = new (ccxt as any).mintme({ enableRateLimit: true });
        console.log('MintMe Exchange initialized');
        
        // Load markets
        await mintme.loadMarkets();
        
        // Fetch assets
        const assets = await mintme.fetchAssets();
        console.log('MintMe Assets:', assets);
        
        return assets;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching MintMe assets:', error.message);
        } else {
            console.error('Unknown error occurred');
        }
        throw error;
    }
}
