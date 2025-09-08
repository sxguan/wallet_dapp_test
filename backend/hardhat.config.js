require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

require('dotenv').config()

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || 
"https://eth-sepolia.g.alchemy.com/v2/WxkybBzUuFyVz5RTJbFjMUWhBHljOgS2"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "abcdef"

module.exports = {

	defaultNetwork: "sepolia",
     	networks: {
        	hardhat: {
             		// // If you want to do some forking, uncomment this
             		// forking: {
             		// url: MAINNET_RPC_URL
             		// }
         	},
         	localhost: {
         	},
         	sepolia: {
             		url: SEPOLIA_RPC_URL,
             		accounts: [PRIVATE_KEY],
             		saveDeployments: true,
         	},
     	},

  solidity: "0.8.28",
i};
