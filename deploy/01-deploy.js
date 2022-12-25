const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify.js");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let priceFeedAddress;
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    priceFeedAddress = ethUsdAggregator.address;
  } else {
    priceFeedAddress = networkConfig[chainId]["priceFeedAddress_ETH_USD"];
  }

  const args = [priceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (chainId !== 31337 && process.env.ETHERSCAN_API_KEY) {
    await verify(fundMe.address, args);
  }

  log("-------------------------------------------------------");
};

module.exports.tags = ["all", "fundMe"];
