// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ReverseDutchAuctionSwap {
    address public seller;
    IERC20 public token;
    uint256 public initialPrice;
    uint256 public startTime;
    uint256 public duration;
    uint256 public priceDecreaseRate; 
    bool public isAuctionActive;
    address public buyer;

    event AuctionStarted(address indexed seller, uint256 initialPrice, uint256 duration);
    event Purchased(address indexed buyer, uint256 price);

    constructor() {
        seller = msg.sender;
    }

    function startAuction(
        address _token,
        uint256 _initialPrice,
        uint256 _duration,
        uint256 _priceDecreaseRate
    ) external {
        require(msg.sender == seller, "Only seller can start auction");
        require(!isAuctionActive, "Auction already active");

        token = IERC20(_token);
        initialPrice = _initialPrice;
        startTime = block.timestamp;
        duration = _duration;
        priceDecreaseRate = _priceDecreaseRate;
        isAuctionActive = true;

        emit AuctionStarted(seller, _initialPrice, _duration);
    }

    function getCurrentPrice() public view returns (uint256) {
        require(isAuctionActive, "Auction not active");
        uint256 elapsedTime = block.timestamp - startTime;
        if (elapsedTime >= duration) {
            return 0; // Auction ended
        }
        uint256 priceDecrease = elapsedTime * priceDecreaseRate;
        return initialPrice > priceDecrease ? initialPrice - priceDecrease : 0;
    }

    function purchase() external payable { 
    require(isAuctionActive, "Auction not active");
    require(buyer == address(0), "Already purchased");

    uint256 currentPrice = getCurrentPrice();
    require(currentPrice > 0, "Auction ended");

    buyer = msg.sender;
    isAuctionActive = false;

    
    token.transfer(buyer, token.balanceOf(address(this)));
    
    payable(seller).transfer(currentPrice);

    emit Purchased(buyer, currentPrice);
}

    function endAuction() external {
        require(msg.sender == seller, "Only seller can end auction");
        require(isAuctionActive, "Auction not active");
        isAuctionActive = false;
    }
}