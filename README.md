# CCXT MintMe Integration

A TypeScript project that integrates the MintMe exchange with the CCXT library. This project provides a custom extension for CCXT to interact with the MintMe cryptocurrency exchange.

## Features

- Custom CCXT exchange implementation for MintMe
- Fetch asset information from MintMe exchange
- Create buy and sell orders on MintMe exchange
- Fetch active user orders with pagination support
- Fetch finished (historical) user orders with pagination support
- Display market data in a formatted table
- TypeScript support for type safety

## Prerequisites

- Node.js (v14 or newer)
- TypeScript
- ts-node for running TypeScript files directly

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd ccxt-mintme-test
npm install
```

## Environment Setup

Create a `.env` file in the root directory with your MintMe API credentials:

```
PUB_API_KEY=your_public_api_key
PRIV_API_KEY=your_private_api_key
```

## Project Structure

- `src/mintme-extension.ts` - Contains the MintMe exchange implementation extending CCXT
- `src/testMintMe.ts` - Example script demonstrating how to use the MintMe integration to fetch assets
- `src/testMintMeOrder.ts` - Example script for creating orders on MintMe exchange
- `src/tests/fetch_active_orders.ts` - Example script for fetching active user orders
- `src/tests/fetch_finished_orders.ts` - Example script for fetching completed/historical user orders

## Usage

### Fetch Asset Information

Run the test script to see the asset information:

```bash
ts-node src/testMintMe.ts
```

### Create Orders

Create orders on MintMe using command line arguments:

```bash
# Basic limit order
ts-node src/testMintMeOrder.ts --base=LAGX --quote=MINTME --price=5 --amount=12.33 --action=buy

# Market order
ts-node src/testMintMeOrder.ts --base=LAGX --quote=MINTME --amount=12.33 --action=buy --market

# Sell order
ts-node src/testMintMeOrder.ts --base=LAGX --quote=MINTME --price=5 --amount=12.33 --action=sell
```

#### Available Order Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `--base` | Base asset symbol | `--base=LAGX` |
| `--quote` | Quote asset symbol | `--quote=MINTME` |
| `--price` | Price per unit (not needed for market orders) | `--price=5` |
| `--amount` | Amount to buy/sell | `--amount=12.33` |
| `--action` | Order type (buy/sell) | `--action=buy` |
| `--donation` | Optional donation amount | `--donation=0.1` |
| `--market` | Flag to use market price | `--market` |
| `--help` | Show help message | `--help` |

### Fetch Active User Orders

Retrieve your active orders with pagination support:

```bash
# Default pagination (offset=0, limit=100)
ts-node src/tests/fetch_active_orders.ts

# Custom pagination
ts-node src/tests/fetch_active_orders.ts --offset=10 --limit=20

# Show help
ts-node src/tests/fetch_active_orders.ts --help
```

### Fetch Finished User Orders

Retrieve your completed/historical orders with pagination support:

```bash
# Default pagination (offset=0, limit=100)
ts-node src/tests/fetch_finished_orders.ts

# Custom pagination
ts-node src/tests/fetch_finished_orders.ts --offset=10 --limit=20

# Show help
ts-node src/tests/fetch_finished_orders.ts --help
```

#### Available Fetch Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `--offset` | Starting position for pagination (default: 0) | `--offset=10` |
| `--limit` | Maximum number of orders to return (default: 100) | `--limit=20` |
| `--help` | Show help message | `--help` |

## API Details

The implementation connects to the MintMe API endpoints:
- Public API: https://www.mintme.com/dev/api/v2
- Documentation: https://mintme.com/docs/api

## License

ISC 