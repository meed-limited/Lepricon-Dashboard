import { createContext } from "react";

const defaultState: UserContext = {
    isConnected: false,
    tokenName: "",
    price: 0,
    stakeSummary: undefined,
};

const UserContext = createContext(defaultState);

export default UserContext;
