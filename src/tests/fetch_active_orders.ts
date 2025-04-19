import * as ccxt from 'ccxt';
import { fetchActiveUserOrders } from '../mintme-extension';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables with absolute path
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Log environment variables for debugging (remove in production)
console.log('PUB_API_KEY available:', !!process.env.PUB_API_KEY);
console.log('PRIV_API_KEY available:', !!process.env.PRIV_API_KEY);

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const params: Record<string, string> = {};
    
    // Define help text
    const helpText = `
Usage: npx ts-node src/tests/fetch_orders.ts [options]

Options:
  --offset=NUMBER     Offset for pagination (default: 0)
  --limit=NUMBER      Maximum number of orders to fetch (default: 100)
  --help              Show this help message

Example:
  npx ts-node src/tests/fetch_orders.ts --offset=0 --limit=20
`;

    // Show help if requested or help flag provided
    if (args.includes('--help')) {
        console.log(helpText);
        process.exit(0);
    }
    
    // Parse arguments
    args.forEach(arg => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.substring(2).split('=');
            if (value !== undefined) {
                params[key] = value;
            }
        }
    });
    
    // Set default values if not provided
    if (!params.offset) params.offset = '0';
    if (!params.limit) params.limit = '100';
    
    return params;
}

/**
 * Example of fetching active orders with MintMe via CCXT
 */
async function testFetchActiveOrders() {
    try {
        console.log('=== MintMe Active Orders Fetch Test ===');
        
        // Ensure the API keys are available
        if (!process.env.PUB_API_KEY || !process.env.PRIV_API_KEY) {
            console.error('Error: API keys not found in environment variables.');
            console.log('Please ensure PUB_API_KEY and PRIV_API_KEY are set in your .env file');
            return;
        }
        
        // Parse command line arguments
        const params = parseArgs();
        
        // Convert string parameters to numbers
        const offset = parseInt(params.offset, 10);
        const limit = parseInt(params.limit, 10);
        
        console.log('\nFetching active orders from MintMe with these parameters:');
        console.log(`- Offset: ${offset}`);
        console.log(`- Limit: ${limit}`);
        
        // Send the request
        console.log('\nSubmitting request to MintMe...');
        const result = await fetchActiveUserOrders(offset, limit);
        
        // Display the result
        console.log('\nFetch Result:');
        
        // Format the response in a more readable way
        if (result) {
            console.log('----------------------------------------');
            console.log(`Result Code: ${result.result || 'N/A'}`);
            console.log(`Total Orders: ${result.orders?.length || 0}`);
            
            // Highlight the message based on the result
            if (result.message) {
                console.log(`Message: ${result.message}`);
            }
            console.log('----------------------------------------');
            
            // Show a summary of each order
            if (result.orders && result.orders.length > 0) {
                console.log('\nOrders Summary:');
                result.orders.forEach((order: any, index: number) => {
                    console.log(`\nOrder #${index + 1}:`);
                    console.log(`- Order ID: ${order.id || 'N/A'}`);
                    console.log(`- Pair: ${order.base || 'N/A'}/${order.quote || 'N/A'}`);
                    console.log(`- Type: ${order.action || 'N/A'}`);
                    console.log(`- Price: ${order.price || 'N/A'} ${order.quote || ''}`);
                    console.log(`- Amount: ${order.amount || 'N/A'} ${order.base || ''}`);
                    console.log(`- Status: ${order.status || 'N/A'}`);
                    console.log(`- Created: ${order.created_at || 'N/A'}`);
                });
            } else {
                console.log('No orders found or returned');
            }
            
            // Show the full response object for reference
            console.log('\nAPI Response:');
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log('No response received from the API');
        }
        
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('Unknown error occurred');
        }
    }
}

// Execute the test
testFetchActiveOrders().then(() => {
    console.log('\nMintMe active orders fetch test completed!');
}).catch(error => {
    console.error('Fatal error:', error);
}); 