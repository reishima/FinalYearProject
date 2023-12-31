var StudentAide = artifacts.require("../StudentAide.sol");

module.exports = async function(deployer){
    await deployer.deploy(StudentAide);
    const studentAide = await StudentAide.deployed();
    console.log("StudentAide deployed to: ", studentAide.address);
};