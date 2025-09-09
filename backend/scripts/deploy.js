const hre = require("hardhat");

async function main() {
  const PriceConsumer = await hre.ethers.getContractFactory("PriceConsumerV3");
  console.log("Deploying PriceConsumerV3 contract...");
  console.log("Factory:", PriceConsumer);
  
  const priceConsumer = await PriceConsumer.deploy();
  console.log("Contract deployment transaction sent...");
  console.log("Instance:", priceConsumer);

  console.log("PriceConsumerV3 contract deployed to:", priceConsumer.target);
  console.log("");
  console.log("Contract deployment successful!");
  console.log("🎉 Add this address to your frontend .env file:");
  console.log(`REACT_APP_PRICE_CONSUMER_ADDRESS=${priceConsumer.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
