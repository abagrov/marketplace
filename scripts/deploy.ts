import { ethers } from "hardhat";

async function main() {

  const factory721 = await ethers.getContractFactory("Erc721");
  const erc721 = await factory721.deploy();
  await erc721.deployed();

  const factory1155 = await ethers.getContractFactory("Erc1155");
  const erc1155 = await factory1155.deploy();
  await erc1155.deployed();

  const mFactory = await ethers.getContractFactory("Marketplace");
  const marketplace = await mFactory.deploy(erc721.address, erc1155.address);
  await marketplace.deployed();

  console.log(`Marketplace deployed to: ${marketplace.address}, erc721 deployed to: ${erc721.address}, erc1155 deployed to: ${erc1155.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
