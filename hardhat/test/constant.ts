import { formatNumber } from "./utils";

// export const NFTlepriconAddress = "0x777777b9d283ed394e89d11fa853b1e4f885b3e6"; //on ETH
export const NFTtestAddress_BSC = "0xd58b3d5bff6d38bf60bf6316777161e088fbc3c5"; //on BSC testnet

export const duration = {
    threeMonths: 91 * 24 * 3600,
    sixMonths: 182 * 24 * 3600,
    twelveMonths: 364 * 24 * 3600,
};

export const amounts = {
    xxs: formatNumber(50),
    xs: formatNumber(100),
    s: formatNumber(200),
    m: formatNumber(500),
    l: formatNumber(1000),
    xl: formatNumber(10000),
    xxl: formatNumber(1e5),
};

export const vaultsData = {
    noLock: {
        timelock: 0, // in seconds
        apr: 2, //percent
        totalAmountLock: 0,
    },
    threeMonths: {
        timelock: duration.threeMonths, // in seconds
        apr: 4, //percent
        totalAmountLock: 0,
    },
    sixMonths: {
        timelock: duration.sixMonths, // in seconds
        apr: 6, //percent
        totalAmountLock: 0,
    },
    twelveMonths: {
        timelock: duration.twelveMonths, // in seconds
        apr: 8, //percent
        totalAmountLock: 0,
    },
};
