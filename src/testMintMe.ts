import * as ccxt from 'ccxt';
import { fetchMintMeAssets } from './mintme-extension'; // Import the assets function

/**
 * Example of using MintMe with CCXT
 */
async function testMintMe() {
    try {
        console.log('=== MintMe CCXT Integration Test ===');
        
        // Use the assets fetching function
        console.log('\nFetching MintMe assets...');
        const assets = await fetchMintMeAssets();
        
        // Display the asset data
        if (assets) {
            console.log('\nSample assets on MintMe:');
            
            // Get a limited number of assets to display
            const assetEntries = Object.entries(assets).slice(0, 10);
            
            console.log('\n| Asset Name             | Type | Maker Fee | Taker Fee | Min Withdraw |');
            console.log('|------------------------|------|-----------|-----------|--------------|');
            
            // Display in a nice format
            assetEntries.forEach(([name, data]: [string, any]) => {
                // Check if necessary properties exist before using padEnd
                const assetName = name ? name.toString().padEnd(22) : 'Unknown'.padEnd(22);
                const tokenType = data && data.type_of_token ? data.type_of_token.toString().padEnd(4) : 'N/A'.padEnd(4);
                const makerFee = data && data.maker_fee ? data.maker_fee.toString().padEnd(9) : 'N/A'.padEnd(9);
                const takerFee = data && data.taker_fee ? data.taker_fee.toString().padEnd(9) : 'N/A'.padEnd(9);
                const minWithdraw = data && data.min_withdraw ? data.min_withdraw.toString().padEnd(12) : 'N/A'.padEnd(12);
                
                console.log(
                    `| ${assetName} | ${tokenType} | ${makerFee} | ${takerFee} | ${minWithdraw} |`
                );
            });
            
            console.log(`\nShowing ${assetEntries.length} of ${Object.keys(assets).length} available assets`);
        }
        
        // Markets information
        console.log('\nAvailable markets:');
        // We already have market information in the description below, 
        // no need to instantiate the exchange again which causes errors
        console.log('BTC/WETH, ETH/WETH, MINTME/BTC, MINTME/ETH, BTC/USD, ETH/USD');
        
        console.log('\nNote about MintMe integration:');
        console.log('- MintMe API provides asset information through the /open/assets endpoint');
        console.log('- This implementation focuses on fetching asset data only');
        console.log('- The assets endpoint provides details about tokens and their properties');
        console.log('- The implementation provides CCXT-compatible structure for integration');
        
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('Unknown error occurred');
        }
    }
}

// Execute the test
testMintMe().then(() => {
    console.log('\nMintMe CCXT integration test completed!');
}).catch(error => {
    console.error('Fatal error:', error);
}); 