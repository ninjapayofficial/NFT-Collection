# Node + Express Service Starter

This is a simple hello world express.js server.

## Getting Started

Previews should run automatically when starting a workspace. Run the `Show Web Preview` IDX command to see the preview.# NFT-Collection




## Getting Started

Server should run automatically when starting a workspace. To run manually, run:
```sh
npm run dev
```


```markdown
# ERC721 Thirdweb Token Contract

This repository contains an ERC20 token contract using Thirdweb. The contract can be deployed and interacted with using a set of API endpoints provided in the `index.js` file.

## Prerequisites

- Node.js (v14.x or higher)
- NPM 
- Thirdweb account for API key
- MetaMask account for deploying contracts

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/erc20-thirdweb-token.git
   cd nft-collection
   ```

2. Install the dependencies:
   ```sh
   npm init -y
   npm install
   ```

3. Install Thirdweb SDK and other necessary packages (choose hardhat in options):
   ```sh
   npm install @thirdweb-dev/sdk ethers express dotenv cors body-parser
   npm install -g @thirdweb-dev/cli
   thirdweb create
   
   ```

4. Create a `config.js` file in the root directory and add the following environment variables:
   ```config.js
   module.exports = {
    privateKey: 'eth-account-privatekey-here',
    thirdwebApiKey: 'your_thirdweb_api_key_here',
    deployerAddress: 'your_deployer_address_here',
    port: 8080
   };
   ```

5. Start the API Express server:
   ```sh
   node index.js
   ```

## Usage

### Start the Server

To start the API Express server, run:
```sh
node index.js
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

