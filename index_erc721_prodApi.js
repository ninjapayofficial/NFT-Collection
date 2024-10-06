import express from 'express';
import { ethers } from "ethers";
import dotenv from "dotenv";
import cors from 'cors';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// Load environment variables
dotenv.config();

// Validate environment variables
const requiredEnvVars = ['PRIVATE_KEY', 'INFURA_PROJECT_ID', 'THIRDWEB_API_KEY', 'DEPLOYER_ADDRESS'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.PRIVATE_KEY,
  "sepolia",
  {
    secretKey: process.env.THIRDWEB_API_KEY,
  },
);

app.post('/deployNFT', async (req, res) => {
  try {
    const { name, symbol } = req.body;

    const contractAddress = await sdk.deployer.deployBuiltInContract(
      "nft-collection",
      {
        name: name,
        symbol: symbol,
        primary_sale_recipient: ethers.constants.AddressZero,
        image: "https://file.notion.so/f/f/87ea3c95-99bf-4229-adac-65d62c260eae/0e5b8296-c4c0-4613-8f4c-b4aa6fb4cb3f/L2.svg?id=35f3b023-e479-4df2-873e-df95ed9aefd6&table=block&spaceId=87ea3c95-99bf-4229-adac-65d62c260eae&expirationTimestamp=1720180800000&signature=ifgF5uHETmgcPqwsGqinqAOfZbmoqqo-XmLBSUU8hxQ&downloadName=L2.svg",
        description: "This is Nin Token",
        external_link: "https://ninjapay.in",
        platform_fee_recipient: ethers.constants.AddressZero,
        platform_fee_basis_points: 100 // 1%
      },
      "5.0.2", // Specify the version
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

app.post('/mintNFT', async (req, res) => {
  try {
    const { contractAddress, toAddress, imageUrl } = req.body;

    // Creating a minimal metadata object with the image URL
    const metadata = {
      name: "NFT Name", // This can be dynamic as well
      description: "NFT Description", // This can be dynamic as well
      image: imageUrl
    };

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");
    const mintResult = await nftContract.erc721.mintTo(toAddress, metadata);

    console.log(`Minted NFT to ${toAddress}`);
    res.json({ message: `Minted NFT to ${toAddress}`, mintResult });
  } catch (error) {
    console.error("Error minting NFT:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/transferNFT', async (req, res) => {
  try {
    const { contractAddress, fromAddress, toAddress, tokenId } = req.body;

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");
    await nftContract.erc721.transferFrom(fromAddress, toAddress, tokenId);

    console.log(`Transferred NFT with tokenId ${tokenId} from ${fromAddress} to ${toAddress}`);
    res.json({ message: `Transferred NFT with tokenId ${tokenId} from ${fromAddress} to ${toAddress}` });
  } catch (error) {
    console.error("Error transferring NFT:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/totalSupplyNFT', async (req, res) => {
  try {
    const { contractAddress } = req.query;

    const nftContract = await sdk.getContract(contractAddress, "nft-collection");
    const totalSupply = await nftContract.erc721.totalSupply();

    console.log(`Total supply: ${totalSupply}`);
    res.json({ totalSupply });
  } catch (error) {
    console.error("Error getting total supply:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// curl -X POST http://localhost:3001/deployNFT -H "Content-Type: application/json" -d '{"name": "MyNFTCollection", "symbol": "MNFT"}'

// curl -X POST http://localhost:3001/mintNFT -H "Content-Type: application/json" -d '{"contractAddress": "0xYourContractAddress", "toAddress": "0xRecipientAddress", "imageUrl": "https://your-image-url.com/image.png"}'

// curl -X POST http://localhost:3001/transferNFT -H "Content-Type: application/json" -d '{"contractAddress": "0xYourContractAddress", "fromAddress": "0xYourAddress", "toAddress": "0xRecipientAddress", "tokenId": "1"}'

// curl -X GET http://localhost:3001/totalSupplyNFT?contractAddress=0xYourContractAddress

// curl -X POST http://localhost:3001/mintNFT -H "Content-Type: application/json" -d '{"contractAddress": "0xdF0a4E291ccc29e07D209372a8cC0e1BC15AFB50", "toAddress": "0x628d4CE58b5bbd404069D741Fa42688632C39d22, "name": "NFT Name", "description": "Nft Description" "imageUrl": "https://your-image-url.com/image.png"}'
