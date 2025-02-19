const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ReverseDutchAuctionSwap", function () {
    let seller, buyer;
    let token, swap;
    const initialPrice = ethers.parseEther("100");
    const duration = 600; // 10 minutes
    const priceDecreaseRate = ethers.parseEther("0.1");

    beforeEach(async function () {
        [seller, buyer] = await ethers.getSigners();

        // Deploy a real ERC20 token using OpenZeppelin's implementation
        const Token = await ethers.getContractFactory("ERC20");
        token = await Token.deploy("TestToken", "TT");
        await token.waitForDeployment();

        // Mint tokens to the seller
        await token.mint(seller.address, ethers.parseEther("1000"));

        // Deploy ReverseDutchAuctionSwap
        const Swap = await ethers.getContractFactory("ReverseDutchAuctionSwap");
        swap = await Swap.deploy();
        await swap.waitForDeployment();

        // Approve tokens for the swap contract
        await token.connect(seller).approve(swap.target, ethers.parseEther("100"));

        // Start the auction
        await swap.connect(seller).startAuction(token.target, initialPrice, duration, priceDecreaseRate);
    });

    it("should decrease price correctly over time", async function () {
        await ethers.provider.send("evm_increaseTime", [300]); // Increase time by 5 minutes
        await ethers.provider.send("evm_mine");

        const currentPrice = await swap.getCurrentPrice();
        expect(currentPrice).to.equal(initialPrice - (priceDecreaseRate * 300n));
    });

    it("should allow only one buyer to purchase", async function () {
        await swap.connect(buyer).purchase({ value: initialPrice });
        await expect(swap.connect(buyer).purchase({ value: initialPrice })).to.be.revertedWith("Already purchased");
    });

    it("should transfer tokens and funds correctly", async function () {
        await swap.connect(buyer).purchase({ value: initialPrice });

        const buyerBalance = await token.balanceOf(buyer.address);
        expect(buyerBalance).to.equal(ethers.parseEther("100"));

        const sellerBalance = await ethers.provider.getBalance(seller.address);
        expect(sellerBalance).to.equal(initialPrice);
    });

    it("should end auction if no buyer purchases", async function () {
        await ethers.provider.send("evm_increaseTime", [duration + 1]); // Increase time beyond duration
        await ethers.provider.send("evm_mine");

        const currentPrice = await swap.getCurrentPrice();
        expect(currentPrice).to.equal(0);

        await expect(swap.connect(buyer).purchase({ value: initialPrice })).to.be.revertedWith("Auction ended");
    });
});