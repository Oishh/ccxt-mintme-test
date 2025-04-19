import * as ccxt from 'ccxt';
import axios, { AxiosError } from 'axios';

// Declare the module augmentation to add mintme to ccxt
declare module 'ccxt' {
    export const mintme: typeof MintMeExchange;
}

interface MintMeOrder {
    base: string;
    quote: string;
    priceInput: string;
    amountInput: string;
    donationAmount: string;
    marketPrice: boolean;
    action: string;
}

interface MintMeParams {
    donationAmount?: string;
    priceInput?: string;
    amountInput?: string;
    marketPrice?: boolean;
    action?: string;
    [key: string]: any;
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

    // Direct method for creating orders with MintMe's specific payload format
    async createMintMeOrder(mintMeOrder: MintMeOrder): Promise<any> {
        try {
            const response = await axios.post(
                `${this.urls.api.private}/auth/user/orders`, 
                mintMeOrder,
                {
                    headers: {
                        'X-API-ID': process.env.PUB_API_KEY,
                        'X-API-KEY': process.env.PRIV_API_KEY
                    }
                }
            );

            // Return the response data regardless of status
            // This allows capturing result codes and messages
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                // If the API returned a response with an error, return the response data
                // This captures cases like "Insufficient Balance" which return error codes
                if (error.response.data) {
                    return error.response.data;
                }
                throw new Error(`MintMe API error: ${error.response.status} ${error.response.statusText}`);
            } else {
                throw error;
            }
        }
    }

    // Fetch active user orders
    async fetchActiveUserOrders(offset: number = 0, limit: number = 100): Promise<any> {
        try {
            const response = await axios.get(
                `${this.urls.api.private}/auth/user/orders/active?offset=${offset}&limit=${limit}`,
                {
                    headers: {
                        'X-API-ID': process.env.PUB_API_KEY,
                        'X-API-KEY': process.env.PRIV_API_KEY
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                if (error.response.data) {
                    return error.response.data;
                }
                throw new Error(`MintMe API error: ${error.response.status} ${error.response.statusText}`);
            } else {
                throw error;
            }
        }
    }

    // Fetch finished user orders
    async fetchFinishedUserOrders(offset: number = 0, limit: number = 100): Promise<any> {
        try {
            const response = await axios.get(
                `${this.urls.api.private}/auth/user/orders/finished?offset=${offset}&limit=${limit}`,
                {
                    headers: {
                        'X-API-ID': process.env.PUB_API_KEY,
                        'X-API-KEY': process.env.PRIV_API_KEY
                    }
                }
            );

            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                if (error.response.data) {
                    return error.response.data;
                }
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

export async function createMintMeOrder(order: MintMeOrder) {
    try {
        const mintme = new (ccxt as any).mintme({ enableRateLimit: true });
        console.log('MintMe Exchange initialized');

        // Log the order details being sent to the API
        console.log('Sending order to MintMe API:', {
            base: order.base,
            quote: order.quote,
            action: order.action,
            price: order.marketPrice ? 'MARKET' : order.priceInput,
            amount: order.amountInput,
            donation: order.donationAmount,
            marketPrice: order.marketPrice
        });

        const result = await mintme.createMintMeOrder(order);
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating MintMe order:', error.message);
        } else {
            console.error('Unknown error occurred');
        }
        throw error;
    }
}

export async function fetchActiveUserOrders(offset: number = 0, limit: number = 100) {
    try {
        const mintme = new (ccxt as any).mintme({ enableRateLimit: true });
        console.log('MintMe Exchange initialized');
        
        console.log(`Fetching active user orders with offset=${offset}, limit=${limit}`);
        
        const result = await mintme.fetchActiveUserOrders(offset, limit);
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching MintMe active orders:', error.message);
        } else {
            console.error('Unknown error occurred');
        }
        throw error;
    }
}

export async function fetchFinishedUserOrders(offset: number = 0, limit: number = 100) {
    try {
        const mintme = new (ccxt as any).mintme({ enableRateLimit: true });
        console.log('MintMe Exchange initialized');
        
        console.log(`Fetching finished user orders with offset=${offset}, limit=${limit}`);
        
        const result = await mintme.fetchFinishedUserOrders(offset, limit);
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching MintMe finished orders:', error.message);
        } else {
            console.error('Unknown error occurred');
        }
        throw error;
    }
}
