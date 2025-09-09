import React, { useEffect, useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';

const contractAddress = process.env.REACT_APP_PRICE_CONSUMER_ADDRESS || '0x694AA1769357215DE4FAC081bf1f309aDC325306';

const PRICE_CONSUMER_ABI = [
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
  const [contract, setContract] = useState(null);
  const [currentPrice, setCurrentPrice] = useState("");
  const [storedPrice, setStoredPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this dApp.");
        return;
      }

      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const contractInstance = new Contract(contractAddress, PRICE_CONSUMER_ABI, signer);
        
        setContract(contractInstance);
        setAccount(address);
        setConnected(true);
        
        await loadPrices(contractInstance);
      } catch (error) {
        console.error("Failed to connect:", error);
      }
    };

    init();
  }, []);

  const loadPrices = async (contractInstance) => {
    if (!contractInstance) return;
    
    try {
      const latest = await contractInstance.getLatestPrice();
      const stored = await contractInstance.storedPrice();
      
      setCurrentPrice((Number(latest) / 1e8).toFixed(2));
      setStoredPrice((Number(stored) / 1e8).toFixed(2));
    } catch (error) {
      console.error("Failed to load prices:", error);
    }
  };

  const handleStorePrice = async () => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const tx = await contract.storeLatestPrice();
      await tx.wait();
      await loadPrices(contract);
      alert("Price stored successfully!");
    } catch (error) {
      console.error("Failed to store price:", error);
      alert("Transaction failed.");
    }
    setLoading(false);
  };

  const handleRefreshPrice = async () => {
    if (!contract) return;
    await loadPrices(contract);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 flex items-center justify-center px-4">
      <div className="bg-white/10 backdrop-blur-lg border border-gray-700 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          📊 Chainlink Price Feed
        </h1>
        
        {connected ? (
          <>
            <div className="mb-6 p-4 bg-black/20 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">Connected Account:</p>
              <p className="text-xs text-blue-300 font-mono break-all">{account}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Current ETH/USD Price</h3>
                <p className="text-3xl font-bold text-green-400">
                  ${currentPrice || "Loading..."}
                </p>
                <button
                  onClick={handleRefreshPrice}
                  className="mt-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Refresh
                </button>
              </div>
              
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Stored Price</h3>
                <p className="text-2xl font-bold text-yellow-400">
                  ${storedPrice || "Not stored"}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleStorePrice}
              disabled={loading}
              className={`w-full font-semibold py-3 rounded-lg shadow-md transition-all text-white ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 hover:shadow-xl active:scale-95"
              }`}
            >
              {loading ? "Storing..." : "Store Current Price"}
            </button>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              Powered by Chainlink Oracles on Sepolia Network
            </p>
          </>
        ) : (
          <div className="text-center">
            <p className="text-white mb-4">Please connect your MetaMask wallet to continue.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;