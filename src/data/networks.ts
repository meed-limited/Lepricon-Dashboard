import { Chain } from "wagmi";

export const mumbai: Chain = {
    id: 80001,
    name: "Mumbai Testnet",
    network: "Mumbai",
    nativeCurrency: {
        decimals: 18,
        name: "MATIC",
        symbol: "MATIC",
    },
    rpcUrls: {
        default: { http: [`${process.env.REACT_APP_NODE_MUMBAI}`] },
    },
    blockExplorers: {
        default: { name: "", url: "https://mumbai.polygonscan.com/" },
    },
    testnet: true,
};

export const polygon: Chain = {
    id: 137,
    name: "Polygon network",
    network: "Polygon",
    nativeCurrency: {
        decimals: 18,
        name: "MATIC",
        symbol: "MATIC",
    },
    rpcUrls: {
        default: { http: [`${process.env.REACT_APP_NODE_POLYGON}`] },
    },
    blockExplorers: {
        default: { name: "", url: "https://polygonscan.com/" },
    },
    testnet: false,
};
