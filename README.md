# CCXT MintMe Integration

A TypeScript project that integrates the MintMe exchange with the CCXT library. This project provides a custom extension for CCXT to interact with the MintMe cryptocurrency exchange.

## Features

- Custom CCXT exchange implementation for MintMe
- Fetch asset information from MintMe exchange
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

## Project Structure

- `src/mintme-extension.ts` - Contains the MintMe exchange implementation extending CCXT
- `src/testMintMe.ts` - Example script demonstrating how to use the MintMe integration

## Usage

Run the test script to see the integration in action:

```bash
ts-node src/testMintMe.ts
```

## Available Markets

The integration currently supports the following markets:
- BTC/WETH
- ETH/WETH
- MINTME/BTC
- MINTME/ETH
- BTC/USD
- ETH/USD

## API Details

The implementation connects to the MintMe API endpoints:
- Public API: https://www.mintme.com/dev/api/v2
- Documentation: https://mintme.com/docs/api

## License

ISC 