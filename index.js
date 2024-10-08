
// const express = require('express');
// const path = require('path')
// const cors = require('cors')
// const bodyParser = require('body-parser');
// const { ThirdwebSDK } = require('@thirdweb-dev/sdk');
// const { ethers } = require('ethers');
// const config = require('./config');


// const app = express();
// const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs');

  
// // app.get('/', (req, res) => {
// //   res.render('index.html');
// // });
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// let userKeys = {};

// // const sdk = ThirdwebSDK.fromPrivateKey(
// //   process.env.PRIVATE_KEY,
// //   "sepolia",
// //   {
// //     secretKey: process.env.THIRDWEB_API_KEY,
// //   },
// // );

// app.post('/setKeys', (req, res) => {
//   const { name, symbol, privateKey } = req.body;
//   userKeys = { name, symbol, privateKey };
//   res.json({ message: "Keys set successfully" });
// });

// app.post('/deployNFT', async (req, res) => {
//   console.log('Received /deployNFT request');
//   try {
//     const { name, symbol, privateKey } = userKeys;
//     if (!name || !symbol || !privateKey) {
//       console.error('Missing required keys:', userKeys);
//       return res.status(400).json({ error: 'Missing required keys' });
//     }

//     console.log('Deploying NFT with keys:', userKeys);

//     const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
//       secretKey: config.thirdwebApiKey,
//     });

//     const contractAddress = await sdk.deployer.deployBuiltInContract(
//       "nft-collection",
//       {
//         name: name,
//         symbol: symbol,
//         primary_sale_recipient: ethers.constants.AddressZero,
//         image: "https://file.notion.so/f/f/87ea3c95-99bf-4229-adac-65d62c260eae/0e5b8296-c4c0-4613-8f4c-b4aa6fb4cb3f/L2.svg?id=35f3b023-e479-4df2-873e-df95ed9aefd6&table=block&spaceId=87ea3c95-99bf-4229-adac-65d62c260eae&expirationTimestamp=1720180800000&signature=ifgF5uHETmgcPqwsGqinqAOfZbmoqqo-XmLBSUU8hxQ&downloadName=L2.svg",
//         description: "This is Nin Token",
//         external_link: "https://ninjapay.in",
//         platform_fee_recipient: ethers.constants.AddressZero,
//         platform_fee_basis_points: 100 // 1%
//       },
//       "5.0.2", // Specify the version
//       {
//         gasLimit: 5000000, // Set a higher gas limit
//       }
//     );

//     console.log("NFT Contract deployed to:", contractAddress);
//     res.json({ message: "NFT Contract deployed successfully", contractAddress });
//   } catch (error) {
//     console.error("Error deploying NFT contract:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // app.post('/mintNFT', async (req, res) => {
// //   try {
// //     const { contractAddress, toAddress, name, description, imageUrl } = req.body;

// //     // Creating a minimal metadata object with the image URL
// //     const metadata = {
// //       name: name, // This can be dynamic as well
// //       description: description, // This can be dynamic as well
// //       image: imageUrl
// //     };

// //     const nftContract = await sdk.getContract(contractAddress, "nft-collection");
// //     const mintResult = await nftContract.erc721.mintTo(toAddress, metadata);

// //     console.log(`Minted NFT to ${toAddress}`);
// //     res.json({ message: `Minted NFT to ${toAddress}`, mintResult });
// //   } catch (error) {
// //     console.error("Error minting NFT:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// app.post('/mintNFT', async (req, res) => {
//   console.log('Received /mintNFT request');
//   try {
//     const { privateKey, contractAddress, toAddress, name, description, imageUrl } = req.body;

//     if (!privateKey || !contractAddress || !toAddress || !name || !description || !imageUrl) {
//       console.error('Missing required fields in request body');
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     console.log('Minting NFT with privateKey:', privateKey);

//     const sdk = ThirdwebSDK.fromPrivateKey(privateKey, "sepolia", {
//       secretKey: config.thirdwebApiKey,
//     });

//     const nftContract = await sdk.getContract(contractAddress, "nft-collection");

//     const metadata = {
//       name: name,
//       description: description,
//       image: imageUrl
//     };

//     const mintResult = await nftContract.erc721.mintTo(toAddress, metadata);

//     console.log(`Minted NFT to ${toAddress}`);
//     res.json({ message: `Minted NFT to ${toAddress}`, mintResult });
//   } catch (error) {
//     console.error("Error minting NFT:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/test', (req, res) => {
//   res.send('Server is running');
// });

// app.get('/api', (req, res) => {
//   res.json({"msg": "Hello world"});
// });

// app.listen(port, () => {
//   console.log(`Listening on http://localhost:${port}`);
// })



const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Optional: Keep this endpoint to test if the server is running
app.get('/test', (req, res) => {
  res.send('Server is running');
});

// Optional: API endpoint
app.get('/api', (req, res) => {
  res.json({ "msg": "Hello world" });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
