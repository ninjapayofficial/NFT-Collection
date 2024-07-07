const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { ThirdwebSDK } = require('@thirdweb-dev/sdk');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(bodyParser.json());  // Middleware to parse JSON bodies
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

app.post('/deployNFT', async (req, res) => {
  try {
    const { name, symbol, privateKey } = userKeys;
    const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
      secretKey: process.env.THIRDWEB_API_KEY,
    });

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

app.get('/test', (req, res) => {
  res.send('Server is running');
});

app.get('/api', (req, res) => {
  res.json({ "msg": "Hello world" });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
