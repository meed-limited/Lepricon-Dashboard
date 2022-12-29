export const isProdEnv = process.env.NEXT_PUBLIC_NODE_ENV === "production" ? true : false;

export const SUPPORTED_CHAIN = {
    mainnet: 137,
    testnet: 80001,
};

export const DEX_URL = "https://quickswap.exchange/#/";

export const URL = isProdEnv ? "https://app.lepricon.io" : "http://localhost:3000";

// Production => Polygon
export const TOKEN = "0x91191A15E778d46255FC9AcD37D028228D97e786";
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
