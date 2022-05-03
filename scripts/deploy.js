async function main() {
  const contractFactory = await ethers.getContractFactory("Hasher");
  console.log("Hasher Factory initialized");
  const HasherFactoryContract = await contractFactory.deploy();
  console.log("Deploying Hasher Factory contract");
  await HasherFactoryContract.deployed();
  console.log("Contract deployed to:", HasherFactoryContract.address);
  return HasherFactoryContract.address;
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
