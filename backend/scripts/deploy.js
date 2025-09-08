const hre = require("hardhat");

async function main() {
  const Phishing = await hre.ethers.getContractFactory("Phishing");
  console.log("Factory object:", Phishing);

  const phishing = await Phishing.deploy();
  console.log("Deployed contract object:", phishing);
  console.log("typeof phishing:", typeof phishing);
  console.log("phishing.deployed:", phishing.deployed); 
 

  console.log("Phishing contract deployed to:", phishing.target);
}

/*
async function main() {

  const PriceConsumer = await hre.ethers.getContractFactory("PriceConsumerV3");
  console.log("Factory:", PriceConsumer);
  const priceConsumer = await PriceConsumer.deploy();
  console.log("Instance:", priceConsumer);

  console.log("Contract deployed to:", priceConsumer.target);
}
*/

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
