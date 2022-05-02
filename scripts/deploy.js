async function main() {
  const contractFactory = await ethers.getContractFactory("RPS");
  console.log("RPSLS Factory initialized");
  const RPSLSFactoryContract = await contractFactory.deploy();
  console.log("Deploying RPSLS Factory contract");
  await RPSLSFactoryContract.deployed();
  console.log("Contract deployed to:", RPSLSFactoryContract.address);
  return RPSLSFactoryContract.address;
}

async function runMain() {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

runMain();
