import { BigNumber } from "ethers";

export const isProdEnv = process.env.NEXT_PUBLIC_NODE_ENV === "production" ? true : false;

export const MAX_INT = BigNumber.from(Number.MAX_SAFE_INTEGER - 1);

export const SUPPORTED_CHAIN = {
    mainnet: 137,
    testnet: 80001,
};

export const SUPPORTED_CHAIN_NFT = {
    mainnet: 0x1,
    testnet: 0x5,
};

// export const URL = isProdEnv ? "https://www.app.lepricon.io/" : "http://localhost:3000/"; // Front-end server
export const URL = "https://www.app.lepricon.io/"; // Front-end server
export const DEX_URL = "https://quickswap.exchange/#/";

// Production => Polygon
export const TOKEN = "0x76Bba8c6D70690514e642cb68C93AF9a2ac826A4"; // LEP token
export const LEPRICON_NFT = "0x777777b9d283ed394e89d11fa853b1e4f885b3e6"; //ETH
export const STAKING = "";

// Development => Mumbai
export const TOKEN_TEST = "0xE413Bfbc963fdB56Fe12A2501aa58cD4913553ef";
export const LEPRICON_NFT_TEST = "0x0ef2Abd26730F419d73074552344bEb3BBBA1B08"; // GOERLI
export const STAKING_TEST = "0xA7b9A505554eFADa9fFaFb34f4D28c5c3F2A7619";

export const getContractAddresses = () => {
    if (isProdEnv) {
        return {
            token: TOKEN,
            nft: LEPRICON_NFT,
            staking: STAKING,
        };
    } else
        return {
            token: TOKEN_TEST,
            nft: LEPRICON_NFT_TEST,
            staking: STAKING_TEST,
        };
};

export const getChain = () => {
    if (isProdEnv) {
        return SUPPORTED_CHAIN.mainnet;
    } else {
        return SUPPORTED_CHAIN.testnet;
    }
};

export const NFT_CHAIN = isProdEnv ? SUPPORTED_CHAIN_NFT.mainnet : SUPPORTED_CHAIN_NFT.testnet;
