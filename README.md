# a Reverse Dutch Auction SwapBackground

# direction

Most swaps execute at the best available price instantly. In this challenge, you will flip traditional swaps on their head by implementing a Reverse Dutch Auction Swap where the price starts high and decreases over time until a buyer accepts.

📌 Task Breakdown:1️⃣ Smart Contract (Solidity)
Build a Reverse Dutch Auction Swap Contract where:
✅ A seller lists tokens for sale with:

Initial high price.

Time duration for the auction.

Price decrease rate per second.
✅ A buyer can purchase at the current price, which decreases over time.
✅ When a buyer accepts, the swap finalizes at the current price.
✅ The contract should handle ERC20 token swaps.

2️⃣ Deployment & Scripts (Hardhat)
Write deployment and interaction scripts that:
✅ Deploy the swap contract.
✅ Simulate a seller listing tokens.
✅ Execute the swap at different time intervals.

3️⃣ Writing Tests (Hardhat & Chai)
Write tests for:
✅ Ensuring price decreases correctly over time.
✅ Ensuring only one buyer can purchase per auction.
✅ Ensuring funds and tokens are correctly swapped.
✅ Testing edge cases (e.g., no buyer before auction ends).

--- 

deployment works ✅ 
9/10 tests work ✅  
