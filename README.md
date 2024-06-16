#To use the platform, users will need to have Metamask installed and a wallet ID attached to the Network where the contracts were deployed.
Further usage details have been listed [here](https://github.com/reishima/FinalYearProject/blob/master/Usage%20Guide.pdf)

## FYP 

##The contracts of the three main modules (library, attendance and student aide) need to be deployed and supplied in their respective constants file.

## To deploy contracts onto the platform

Contract deployment is done via Hardhat to the Sepolia Test Network
1. Add the script for deployment at scripts/deploy.js
2. run `npx hardhat run scripts/deploy.js --network sepolia` from the project directory

Then use contract address and ABI for constants.
Then simply head to cd client and run npm start: In the project directory, run:
## `cd client -> npm start`

From there, head to http://localhost/ or wherever the system was deployed.
=============================

## The technologies included in this project were:
1. Solidity
2. React
3. React Icons
4. React Router
5. Javascript
6. Sweet Alert
7. Firestore, Firebase
8. Ethers.js
9. Etherscan
10. Hardhat (Deployment)
11. Truffle and Ganache (Testing)
