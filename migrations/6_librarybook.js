var LibraryBook = artifacts.require("../LibraryBook.sol");

module.exports = async function(deployer){
    await deployer.deploy(LibraryBook);
    const libraryBook = await LibraryBook.deployed();
    console.log("LibraryBook deployed to: ", libraryBook.address);
};