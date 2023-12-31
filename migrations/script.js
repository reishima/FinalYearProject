import { Network, Alchemy } from 'alchemy-sdk';

const settings = {
    apiKey: "3U3n7zoDwjIVJHqlpYboHfxi_QaP-P87",
    network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

// get the latest block
const latestBlock = alchemy.core.getBlock("latest").then(console.log);