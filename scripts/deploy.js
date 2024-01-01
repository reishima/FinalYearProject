// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
/*const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.parseEther("0.001");

  const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  await lock.waitForDeployment();

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
*/

const main = async () => {
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();

  await transactions.waitForDeployment();

  console.log("Transactions deployed to:", transactions.target);

  const Authentication = await hre.ethers.getContractFactory("Authentication");
  const authentication = await Authentication.deploy();

  await authentication.waitForDeployment();

  console.log("Authentication deployed to:", authentication.target);

  const CourseAttendance = await hre.ethers.getContractFactory("CourseAttendance");
  const courseattendance = await CourseAttendance.deploy();

  await courseattendance.waitForDeployment();

  console.log("CourseAttendance deployed to:", courseattendance.target);

  const LibraryBook = await hre.ethers.getContractFactory("LibraryBook");
  const librarybook = await LibraryBook.deploy();

  await librarybook.waitForDeployment();

  console.log("LibraryBook deployed to:", librarybook.target);

  const Migration = await hre.ethers.getContractFactory("Migrations");
  const migration = await Migration.deploy();

  await migration.waitForDeployment();

  console.log("Migration deployed to:", migration.target);

  const StudentAide = await hre.ethers.getContractFactory("StudentAide");
  const studentaide = await StudentAide.deploy();

  await studentaide.waitForDeployment();

  console.log("StudentAide deployed to:", studentaide.target);

}


const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();