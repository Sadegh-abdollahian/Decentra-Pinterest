const { network } = require("hardhat");
const { developmentchains } = require("../helper-hardhat-config");
// const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("----------------------------------------------------");
  log("Deploying DecentraPinterest , waiting for confirmations...");
  const decentraPinterest = await deploy("DecentraPinterest", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`DecentraPinterest deployed at ${decentraPinterest.address}`);

  // if (
  //   !developmentchains.includes(network.name) &&
  //   process.env.ETHERSCAN_APIKEY
  // ) {
  //   await verify(decentraPinterest.address, []);
  // }
};
