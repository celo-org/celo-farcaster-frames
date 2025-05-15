# Celo Buy Hypercert Mini App

A Farcaster Frame that allows users to purchase Hypercerts on the Celo blockchain directly from their Farcaster client.

## Overview

This mini app enables users to:
- Browse available Hypercerts on the Celo blockchain
- View detailed information about each Hypercert
- Purchase fractions of Hypercerts using CELO tokens
- Complete transactions directly within the Farcaster Frame

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for the frontend
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Farcaster Frame SDK](https://docs.farcaster.xyz/reference/frames/sdk) - For Frame integration
- [Hypercerts SDK](https://docs.hypercerts.org/) - For interacting with Hypercerts
- [ethers.js](https://docs.ethers.org/) - Ethereum library for blockchain interactions
- [RainbowKit](https://www.rainbowkit.com/) - Wallet connection UI components
- [Wagmi](https://wagmi.sh/) - React hooks for Ethereum

## Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- A Farcaster account for testing

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd celo-buy-hypercert-miniapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_URL=your_app_url
   ```

## Development

To run the app locally:

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Usage

1. Connect your wallet using the "Connect Wallet" button.
2. Browse the available Hypercerts.
3. Click on a Hypercert to view its details.
4. Enter the number of units you wish to purchase and select the currency (CELO or USD).
5. Click "Buy Fractions" to complete the transaction.

## Contributing

We welcome contributions! If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.
