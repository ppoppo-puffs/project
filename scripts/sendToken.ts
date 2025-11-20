import { Relayer } from 'defender-relay-client';
import { ethers } from 'ethers';
import 'dotenv/config'
import winston from 'winston';

const relayer = new Relayer({
  apiKey: process.env.relayer_api_key,
  apiSecret: process.env.relayer_api_secret
});

const recipientAddress = process.env.recipient_address;
const tokenContractAddress = process.env.token_contract_address;
const amount = process.env.amount;
// const decimals = process.env.decimals;
const amountToSend = ethers.parseUnits(amount, 18);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'sendToken' },
  transports: [
    new winston.transports.File({ filename: 'sendToken.log' }),
    new winston.transports.Console(),
  ],
});

const requiredVariables = ['relayer_api_key', 'relayer_api_secret'];
requiredVariables.forEach((varName) => {
  if (!process.env[varName]) {
    logger.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

// ABI of the ERC20 token contract
const abi = [
  "function transfer(address to, uint amount) returns (bool)"
];

// Create an instance of the token contract
const provider = ethers.getDefaultProvider();
const tokenContract = new ethers.Contract(tokenContractAddress, abi, provider);

// Encode the transfer function call
const data = tokenContract.interface.encodeFunctionData('transfer', [recipientAddress, amountToSend]);

const main = async () => {

  try {
    const tx = await relayer.sendTransaction({
      to: tokenContractAddress,
      data,
      gasLimit: process.env.gas_limit,
      speed: process.env.speed
    });
    logger.info('Transaction sent:', tx);
  } catch (error) {
    logger.error('Error sending transaction:', error);
  }
};

main();