var CourseAttendance = artifacts.require("../CourseAttendance.sol");

module.exports = async function(deployer){
    await deployer.deploy(CourseAttendance);
    const courseAttendance = await CourseAttendance.deployed();
    console.log("StudentAide deployed to: ", courseAttendance.address);
};