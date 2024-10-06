const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ThirdwebSDK } = require('@thirdweb-dev/sdk');
const { ethers } = require('ethers');
const config = require('./config'); // Ensure this file contains your Thirdweb API key

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let userKeys = {};

app.post('/setKeys', (req, res) => {
  const { name, symbol, privateKey } = req.body;
  userKeys = { name, symbol, privateKey };
  res.json({ message: "Keys set successfully" });
});

// Deploy NFT Contract
app.post('/deployNFT', async (req, res) => {
  console.log('Received /deployNFT request');
  try {
    const { name, symbol, privateKey } = userKeys;
    if (!name || !symbol || !privateKey) {
      console.error('Missing required keys:', userKeys);
      return res.status(400).json({ error: 'Missing required keys' });
    }

    console.log('Deploying NFT with keys:', userKeys);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const contractAddress = await sdk.deployer.deployBuiltInContract(
      "nft-collection",
      {
        name: name,
        symbol: symbol,
        primary_sale_recipient: ethers.constants.AddressZero,
        image: "https://your-image-url.com/image.png",
        description: "This is an NFT Collection",
        external_link: "https://your-website.com",
        platform_fee_recipient: ethers.constants.AddressZero,
        platform_fee_basis_points: 100 // 1%
      },
      "5.0.1", // Specify the version
      {
        gasLimit: 5000000, // Set a higher gas limit
      }
    );

    console.log("NFT Contract deployed to:", contractAddress);
    res.json({ message: "NFT Contract deployed successfully", contractAddress });
  } catch (error) {
    console.error("Error deploying NFT contract:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mint NFT
app.post('/mintNFT', async (req, res) => {
  console.log('Received /mintNFT request');
  try {
    const { privateKey, contractAddress, toAddress, name, description, imageUrl } = req.body;

    if (!privateKey || !contractAddress || !toAddress || !name || !description || !imageUrl) {
      console.error('Missing required fields in request body');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Minting NFT with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");

    const metadata = {
      name: name,
      description: description,
      image: imageUrl
    };

    const mintResult = await nftContract.erc721.mintTo(toAddress, metadata);

    console.log(`Minted NFT to ${toAddress}`);
    res.json({ message: `Minted NFT to ${toAddress}`, mintResult });
  } catch (error) {
    console.error("Error minting NFT:", error);
    res.status(500).json({ error: error.message });
  }
});

// Transfer NFT
app.post('/transferNFT', async (req, res) => {
  console.log('Received /transferNFT request');
  try {
    const { privateKey, contractAddress, toAddress, tokenId } = req.body;

    if (!privateKey || !contractAddress || !toAddress || tokenId === undefined) {
      console.error('Missing required fields in request body');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Transferring NFT with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");

    const transferResult = await nftContract.erc721.transfer(toAddress, tokenId);

    console.log(`Transferred NFT with tokenId ${tokenId} to ${toAddress}`);
    res.json({ message: `Transferred NFT with tokenId ${tokenId} to ${toAddress}`, transferResult });
  } catch (error) {
    console.error("Error transferring NFT:", error);
    res.status(500).json({ error: error.message });
  }
});

// Burn NFT
app.post('/burnNFT', async (req, res) => {
  console.log('Received /burnNFT request');
  try {
    const { privateKey, contractAddress, tokenId } = req.body;

    if (!privateKey || !contractAddress || tokenId === undefined) {
      console.error('Missing required fields in request body');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Burning NFT with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");

    const burnResult = await nftContract.erc721.burn(tokenId);

    console.log(`Burned NFT with tokenId ${tokenId}`);
    res.json({ message: `Burned NFT with tokenId ${tokenId}`, burnResult });
  } catch (error) {
    console.error("Error burning NFT:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get NFT Metadata
app.get('/getNFTMetadata', async (req, res) => {
  console.log('Received /getNFTMetadata request');
  try {
    const { privateKey, contractAddress, tokenId } = req.query;

    if (!privateKey || !contractAddress || tokenId === undefined) {
      console.error('Missing required fields in query parameters');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Fetching NFT metadata with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");

    const metadata = await nftContract.erc721.get(tokenId);

    console.log(`Fetched metadata for tokenId ${tokenId}`);
    res.json({ metadata });
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    res.status(500).json({ error: error.message });
  }
});

// List All NFTs
app.get('/listNFTs', async (req, res) => {
  console.log('Received /listNFTs request');
  try {
    const { privateKey, contractAddress } = req.query;

    if (!privateKey || !contractAddress) {
      console.error('Missing required fields in query parameters');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Listing NFTs with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");

    const nfts = await nftContract.erc721.getAll();

    console.log(`Fetched all NFTs from contract ${contractAddress}`);
    res.json({ nfts });
  } catch (error) {
    console.error("Error listing NFTs:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get Owner of NFT
app.get('/getNFTOwner', async (req, res) => {
  console.log('Received /getNFTOwner request');
  try {
    const { privateKey, contractAddress, tokenId } = req.query;

    if (!privateKey || !contractAddress || tokenId === undefined) {
      console.error('Missing required fields in query parameters');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Fetching NFT owner with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");

    const owner = await nftContract.erc721.ownerOf(tokenId);

    console.log(`Owner of tokenId ${tokenId} is ${owner}`);
    res.json({ owner });
  } catch (error) {
    console.error("Error fetching NFT owner:", error);
    res.status(500).json({ error: error.message });
  }
});

// Approve NFT Transfer
app.post('/approveNFT', async (req, res) => {
  console.log('Received /approveNFT request');
  try {
    const { privateKey, contractAddress, toAddress, tokenId } = req.body;

    if (!privateKey || !contractAddress || !toAddress || tokenId === undefined) {
      console.error('Missing required fields in request body');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Approving NFT transfer with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");

    const approveResult = await nftContract.erc721.setApprovalForToken(toAddress, tokenId);

    console.log(`Approved transfer of tokenId ${tokenId} to ${toAddress}`);
    res.json({ message: `Approved transfer of tokenId ${tokenId} to ${toAddress}`, approveResult });
  } catch (error) {
    console.error("Error approving NFT transfer:", error);
    res.status(500).json({ error: error.message });
  }
});

// Set Approval for All NFTs
app.post('/setApprovalForAll', async (req, res) => {
  console.log('Received /setApprovalForAll request');
  try {
    const { privateKey, contractAddress, operatorAddress, approved } = req.body;

    if (!privateKey || !contractAddress || !operatorAddress || approved === undefined) {
      console.error('Missing required fields in request body');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Setting approval for all NFTs with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");

    const approvalResult = await nftContract.erc721.setApprovalForAll(operatorAddress, approved);

    console.log(`Set approval for all NFTs to ${approved} for operator ${operatorAddress}`);
    res.json({ message: `Set approval for all NFTs to ${approved} for operator ${operatorAddress}`, approvalResult });
  } catch (error) {
    console.error("Error setting approval for all NFTs:", error);
    res.status(500).json({ error: error.message });
  }
});

// Check if Operator is Approved for All NFTs
app.get('/isApprovedForAll', async (req, res) => {
  console.log('Received /isApprovedForAll request');
  try {
    const { privateKey, contractAddress, ownerAddress, operatorAddress } = req.query;

    if (!privateKey || !contractAddress || !ownerAddress || !operatorAddress) {
      console.error('Missing required fields in query parameters');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Checking approval for all NFTs with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");

    const isApproved = await nftContract.erc721.isApprovedForAll(ownerAddress, operatorAddress);

    console.log(`Operator ${operatorAddress} is approved for all NFTs of owner ${ownerAddress}: ${isApproved}`);
    res.json({ isApproved });
  } catch (error) {
    console.error("Error checking approval for all NFTs:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get Total Supply of NFTs
app.get('/totalSupply', async (req, res) => {
  console.log('Received /totalSupply request');
  try {
    const { privateKey, contractAddress } = req.query;

    if (!privateKey || !contractAddress) {
      console.error('Missing required fields in query parameters');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Fetching total supply of NFTs with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");

    const totalSupply = await nftContract.erc721.totalCount();

    console.log(`Total supply of NFTs: ${totalSupply}`);
    res.json({ totalSupply });
  } catch (error) {
    console.error("Error fetching total supply of NFTs:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get Balance of NFTs for an Address
app.get('/balanceOf', async (req, res) => {
  console.log('Received /balanceOf request');
  try {
    const { privateKey, contractAddress, ownerAddress } = req.query;

    if (!privateKey || !contractAddress || !ownerAddress) {
      console.error('Missing required fields in query parameters');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Fetching NFT balance with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");

    const balance = await nftContract.erc721.balanceOf(ownerAddress);

    console.log(`Balance of NFTs for address ${ownerAddress}: ${balance}`);
    res.json({ balance });
  } catch (error) {
    console.error("Error fetching NFT balance:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get All Tokens Owned by an Address
app.get('/getOwned', async (req, res) => {
  console.log('Received /getOwned request');
  try {
    const { privateKey, contractAddress, ownerAddress } = req.query;

    if (!privateKey || !contractAddress || !ownerAddress) {
      console.error('Missing required fields in query parameters');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Fetching NFTs owned by address with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");

    const ownedNFTs = await nftContract.erc721.getOwned(ownerAddress);

    console.log(`NFTs owned by address ${ownerAddress}:`, ownedNFTs);
    res.json({ ownedNFTs });
  } catch (error) {
    console.error("Error fetching NFTs owned by address:", error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch Contract Metadata
app.get('/getContractMetadata', async (req, res) => {
  console.log('Received /getContractMetadata request');
  try {
    const { privateKey, contractAddress } = req.query;

    if (!privateKey || !contractAddress) {
      console.error('Missing required fields in query parameters');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Fetching contract metadata with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress);

    const metadata = await nftContract.metadata.get();

    console.log(`Fetched metadata for contract ${contractAddress}`);
    res.json({ metadata });
  } catch (error) {
    console.error("Error fetching contract metadata:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update Contract Metadata
app.post('/updateContractMetadata', async (req, res) => {
  console.log('Received /updateContractMetadata request');
  try {
    const { privateKey, contractAddress, metadata } = req.body;

    if (!privateKey || !contractAddress || !metadata) {
      console.error('Missing required fields in request body');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Updating contract metadata with privateKey:', privateKey);

    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: config.thirdwebApiKey,
    });

    const nftContract = await sdk.getContract(contractAddress);

    const updateResult = await nftContract.metadata.update(metadata);

    console.log(`Updated metadata for contract ${contractAddress}`);
    res.json({ message: `Updated metadata for contract ${contractAddress}`, updateResult });
  } catch (error) {
    console.error("Error updating contract metadata:", error);
    res.status(500).json({ error: error.message });
  }
});

// Other Utility Endpoints
app.get('/test', (req, res) => {
  res.send('Server is running');
});

app.get('/api', (req, res) => {
  res.json({ "msg": "Hello world" });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
