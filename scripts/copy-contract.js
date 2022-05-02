const fs = require("fs");
const path = require("path");

const contractsDir = path.join(__dirname, "/../client/src/assets");

if (!fs.existsSync(contractsDir)) {
  fs.mkdirSync(contractsDir);
}

[
  path.join(__dirname, "/../artifacts/contracts/RPS.sol/RPS.json"),
  path.join(__dirname, "/../artifacts/contracts/RPS.sol/Hasher.json"),
].forEach((file) =>
  fs.copyFileSync(file, path.join(contractsDir, file.split("/").pop()))
);
