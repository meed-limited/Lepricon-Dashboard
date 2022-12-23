import hre, { ethers } from "hardhat";
import fs from "fs";

const IS_PRODUCTION = process.env.NODE_ENV;
const token = IS_PRODUCTION ? process.env.L3P_TOKEN : process.env.TEST_TOKEN;

async function main() {
  const LepriconStaking = await ethers.getContractFactory("LepriconStaking");
  const lepricon_Staking = await LepriconStaking.deploy(token);
  await lepricon_Staking.deployed();

  console.log("\n");
  console.log("LepriconStaking deployed to: ", lepricon_Staking.address);
  console.log("\n");

  // Get GameContract ABI
  const abiFile = JSON.parse(
    fs.readFileSync(
      "./Hardhat/artifacts/contracts/LepriconStaking.sol/LepriconStaking.json",
      "utf8"
    )
  );
  const abi = JSON.stringify(abiFile.abi);

  console.log("LepriconStaking ABI:");
  console.log("\n");
  console.log(abi);
  console.log("\n");

  /** WAITING:
   ************/
  await lepricon_Staking.deployTransaction.wait(7);

  /** VERIFICATION: (see: https://www.npmjs.com/package/@cronos-labs/hardhat-cronoscan)
   *****************/
  await hre.run("verify:verify", {
    address: lepricon_Staking.address,
    constructorArguments: [token],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
