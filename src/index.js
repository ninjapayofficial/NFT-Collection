import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';

let provider;
let signer;
let sdkInstance; // Renamed to avoid conflicts

// Connect Wallet
document.getElementById('connectWalletButton').addEventListener('click', async () => {
  const connectButton = document.getElementById('connectWalletButton');
  connectButton.disabled = true;
  connectButton.innerText = 'Connecting...';

  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();

      // Initialize Thirdweb SDK
      sdkInstance = new ThirdwebSDK(signer);

      console.log('Wallet connected');
      document.getElementById('message').innerText = 'Wallet connected';

      // Optionally hide the connect button
      connectButton.style.display = 'none';

      // Check network
      const network = await provider.getNetwork();
      console.log('Connected network:', network.name);
      document.getElementById('message').innerText += ` | Network: ${network.name}`;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      const errorMessage = error.code === 4001 
        ? 'Connection request rejected by user.' 
        : 'An unexpected error occurred.';
      document.getElementById('message').innerText = `Error: ${errorMessage}`;
      connectButton.disabled = false;
      connectButton.innerText = 'Connect Wallet';
    }
  } else {
    console.error('MetaMask is not installed.');
    document.getElementById('message').innerText = 'MetaMask is not installed.';
    connectButton.disabled = false;
    connectButton.innerText = 'Connect Wallet';
  }
});

// Listen for account changes
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      document.getElementById('message').innerText = 'Please connect to MetaMask.';
      sdkInstance = null;
    } else {
      signer = provider.getSigner();
      sdkInstance = new ThirdwebSDK(signer);
      document.getElementById('message').innerText = 'Wallet connected';
    }
  });

  window.ethereum.on('chainChanged', (chainId) => {
    window.location.reload();
  });
}

// Deploy NFT Collection
document.getElementById('deployForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!sdkInstance) {
    document.getElementById('message').innerText = 'Please connect your wallet first.';
    return;
  }

  // Show loader
  document.getElementById('loader').style.display = 'block';
  document.getElementById('message').innerText = '';

  const name = document.getElementById('name').value;
  const symbol = document.getElementById('symbol').value;

  try {
    // Deploy the contract
    const contractAddress = await sdkInstance.deployer.deployBuiltInContract(
      "nft-collection",
      {
        name: name,
        symbol: symbol,
        primary_sale_recipient: ethers.constants.AddressZero,
        image: "https://example.com/your-image.png",
        description: "This is Nin Token",
        external_link: "https://ninjapay.in",
        platform_fee_recipient: ethers.constants.AddressZero,
        platform_fee_basis_points: 100 // 1%
      },
      "5.0.2", // Specify the version
      {
        gasLimit: 5000000, // Set a higher gas limit if needed
      }
    );

    console.log("NFT Contract deployed to:", contractAddress);
    const etherscanLink = `https://etherscan.io/address/${contractAddress}`;
    document.getElementById('message').innerHTML = `Contract deployed to: <a href="${etherscanLink}" target="_blank">${contractAddress}</a>`;
  } catch (error) {
    console.error('Error deploying contract:', error);
    const errorMessage = error.reason || error.message || 'Unknown error during deployment.';
    document.getElementById('message').innerText = `Deployment Error: ${errorMessage}`;
  } finally {
    // Hide loader
    document.getElementById('loader').style.display = 'none';
  }
});
