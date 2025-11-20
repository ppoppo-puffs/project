import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-ethers";

require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.25",
  defender: {
    apiKey: process.env.defender_key as string,
    apiSecret: process.env.defender_secret as string,
  },
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.infura_api_key}`,
      chainId: 1
    },
  },
};

export default config;
