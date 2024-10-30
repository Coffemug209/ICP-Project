const hre = require("hardhat");

async function main() {
    const ReportContract = await hre.ethers.getContractFactory("ReportContract");
    const reportContract = await ReportContract.deploy();

    await reportContract.deployed();
    console.log("ReportContract deployed to:", reportContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });