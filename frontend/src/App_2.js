import React, { useEffect, useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';

const contractAddress = '0x5c3f445065b05Ac3d49966e0E53A903421d47E6D';

const ABI = [
	{
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "getLatestPrice",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "storeLatestPrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "storedPrice",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];


function App() {
  const [storedPrice, setStoredPrice] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask.");
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new Contract(contractAddress, ABI, signer);
      setContract(contractInstance);

      const price = await contractInstance.storedPrice();
      setStoredPrice(Number(price) / 1e8);
    };

    init().catch(console.error);
  }, []);

  const updatePrice = async () => {
    if (!contract) return;

    try {
      const tx = await contract.storeLatestPrice();
      await tx.wait();
      const updatedPrice = await contract.storedPrice();
      setStoredPrice(Number(updatedPrice) / 1e8);
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Stored ETH/USD Price</h2>
      <p>{storedPrice !== null ? `$${storedPrice}` : "Loading..."}</p>
      <button onClick={updatePrice}>Update Latest Price</button>
    </div>
  );
}

export default App;

