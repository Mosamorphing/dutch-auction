const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const ReverseDutchAuctionSwap = await hre.ethers.getContractFactory("ReverseDutchAuctionSwap");
    const swap = await ReverseDutchAuctionSwap.deploy();
    await swap.waitForDeployment(); 

    console.log("ReverseDutchAuctionSwap deployed to:", swap.target); 
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});