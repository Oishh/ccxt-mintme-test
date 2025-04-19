import * as ccxt from 'ccxt';
import { createMintMeOrder } from '../mintme-extension';
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
Usage: npx ts-node src/testMintMeOrder.ts [options]

Options:
  --base=SYMBOL       Base asset symbol (e.g., LAGX)
  --quote=SYMBOL      Quote asset symbol (e.g., MINTME)
  --price=NUMBER      Price per unit
  --amount=NUMBER     Amount to buy/sell
  --action=TYPE       Order type (buy or sell)
  --donation=NUMBER   Donation amount (default: 0)
  --market            Use market price (no price needed)
  --help              Show this help message

Example:
  npx ts-node src/testMintMeOrder.ts --base=LAGX --quote=MINTME --price=5 --amount=12.33 --action=buy
`;

    // Show help if requested or no arguments provided
    if (args.length === 0 || args.includes('--help')) {
        console.log(helpText);
        process.exit(0);
    }
    
    // Parse arguments
    args.forEach(arg => {
        if (arg === '--market') {
            params.marketPrice = 'true';
        } else if (arg.startsWith('--')) {
            const [key, value] = arg.substring(2).split('=');
            if (value !== undefined) {
                params[key] = value;
            }
        }
    });
    
    // Validate required parameters
    const requiredParams = ['base', 'quote', 'amount', 'action'];
    const missingParams = requiredParams.filter(param => !params[param]);
    
    if (missingParams.length > 0) {
        console.error(`Error: Missing required parameters: ${missingParams.join(', ')}`);
        console.log(helpText);
        process.exit(1);
    }
    
    // If not market price, price is required
    if (params.marketPrice !== 'true' && !params.price) {
        console.error('Error: Price is required when not using market price');
        console.log(helpText);
        process.exit(1);
    }
    
    // Validate action
    if (params.action && !['buy', 'sell'].includes(params.action.toLowerCase())) {
        console.error('Error: Action must be either "buy" or "sell"');
        console.log(helpText);
        process.exit(1);
    }
    
    return params;
}

/**
 * Example of creating orders with MintMe via CCXT
 */
async function testMintMeOrder() {
    try {
        console.log('=== MintMe Order Creation Test ===');
        
        // Ensure the API keys are available
        if (!process.env.PUB_API_KEY || !process.env.PRIV_API_KEY) {
            console.error('Error: API keys not found in environment variables.');
            console.log('Please ensure PUB_API_KEY and PRIV_API_KEY are set in your .env file');
            return;
        }
        
        // Parse command line arguments
        const params = parseArgs();
        
        // Create order from command line arguments
        const sampleOrder = {
            base: params.base,
            quote: params.quote,
            priceInput: params.price || '0',
            amountInput: params.amount,
            donationAmount: params.donation || '0',
            marketPrice: params.marketPrice === 'true',
            action: params.action.toLowerCase()
        };
        
        console.log('\nCreating order on MintMe with these parameters:');
        console.log('\nOrder Details:');
        console.log(`- Type: ${sampleOrder.action.toUpperCase()}`);
        console.log(`- Pair: ${sampleOrder.base}/${sampleOrder.quote}`);
        console.log(`- Price: ${sampleOrder.marketPrice ? 'MARKET PRICE' : sampleOrder.priceInput + ' ' + sampleOrder.quote}`);
        console.log(`- Amount: ${sampleOrder.amountInput} ${sampleOrder.base}`);
        console.log(`- Market Price: ${sampleOrder.marketPrice ? 'Yes' : 'No'}`);
        console.log(`- Donation: ${sampleOrder.donationAmount}`);
        
        // Send the order
        console.log('\nSubmitting order to MintMe...');
        const result = await createMintMeOrder(sampleOrder);
        
        // Display the result
        console.log('\nOrder Result:');
        
        // Format the response in a more readable way
        if (result) {
            console.log('----------------------------------------');
            console.log(`Result Code: ${result.result}`);
            console.log(`Order ID: ${result.orderId || 'None'}`);
            
            // Highlight the message based on the result
            if (result.message) {
                // Display special messages like "Insufficient Balance" more prominently
                console.log(`Message: ${result.message}`);
            }
            console.log('----------------------------------------');
            
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
testMintMeOrder().then(() => {
    console.log('\nMintMe order creation test completed!');
}).catch(error => {
    console.error('Fatal error:', error);
}); 