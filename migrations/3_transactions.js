var Transactions = artifacts.require("../Transactions.sol");

module.exports = async function(deployer){
    await deployer.deploy(Transactions);
    const transactions = await Transactions.deployed();
    console.log("Transactions deployed to: ", transactions.address);
};
