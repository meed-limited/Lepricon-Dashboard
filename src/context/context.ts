import { createContext } from "react";

const defaultState: UserContext = {
    isConnected: false,
    tokenName: "",
    price: 0,
    balances: { native: "0", token: "0" },
    stakeSummary: undefined,
    userNFTs: { result: undefined, total: 0 },
    boostStatus: undefined,
    syncWeb3: () => {},
};

const UserContext = createContext(defaultState);

export default UserContext;
