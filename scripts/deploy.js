const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const Marketplace = await ethers.getContractFactory("NFTMarketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();

  console.log("NFTMarketplace deployed to:", marketplace.address);

  const data = {
    address: marketplace.address,
    abi: JSON.parse(marketplace.interface.format("json")),
  };

  // write into FRONTEND
  const frontendPath = path.join(__dirname, "../frontend/src/Marketplace.json");
  fs.writeFileSync(frontendPath, JSON.stringify(data, null, 2));
  console.log("Marketplace.json written to frontend");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
