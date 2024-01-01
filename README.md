Run with npm start
=============================
Push to git
git add .
git commmit -m "message"
git push origin master
===========================
Deploy contracts 
To deploy a contract on hardhat, add the script for deployment at scripts/deploy.js

then run npx hardhat run scripts/deploy.js --network sepolia

Then use contract address and ABI for constant (ABI should be generated, not sure because generated using tuffle last time. )
