To use the platform, users will need to have Metamask installed and a wallet ID attached to the Sepolia Test Network.

## FYP 

In the project directory, run:
## `cd client -> npm start`
=============================
## To deploy contracts onto the platform

Contract deployment is done via Hardhat to the Sepolia Test Network
1. Add the script for deployment at scripts/deploy.js
2. run `npx hardhat run scripts/deploy.js --network sepolia` from the project directory

Then use contract address and ABI for constants.
