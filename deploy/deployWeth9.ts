import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

import { sk } from "../.secret"

export default async function (hre: HardhatRuntimeEnvironment) {

  // Initialize the wallet.
  const provider = new Provider(hre.userConfig.zkSyncDeploy?.zkSyncNetwork);
  const wallet = new Wallet(sk);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const WETH9Factory = await deployer.loadArtifact("WETH9");

  const deploymentFee = await deployer.estimateDeployFee(WETH9Factory, []);
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  if (Number(parsedFee) >= 0.3) {
    console.log('too much fee, revert!')
    return
  }
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const WETH9 = await deployer.deploy(WETH9Factory, []);

  //obtain the Constructor Arguments
  console.log("constructor args:" + WETH9.interface.encodeDeploy([]));

  // Show the contract info.
  const contractAddress = WETH9.address;
  console.log(`${WETH9.contractName} was deployed to ${contractAddress}`);
}