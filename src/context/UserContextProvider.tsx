import React, { FC, ReactNode, useContext } from "react";

import { useAccount, useNetwork } from "wagmi";

import { useCoinmarketcapAPI } from "../hooks";
import UserContext from "./context";
import { useWeb3Data } from "./useWeb3Data";

type Props = {
    children: ReactNode;
};

const UserDataProvider: FC<Props> = ({ children }) => {
    const { address, isConnected } = useAccount();
    const { tokenName, balances, userNFTs, stakeSummary, boostStatus, syncWeb3 }: Web3Data = useWeb3Data();
    const { price } = useCoinmarketcapAPI();
    const { chain } = useNetwork();
    const chainId: number | undefined = chain !== undefined ? chain.id : undefined;

    return (
        <UserContext.Provider
            value={{
                address,
                chainId,
                isConnected,
                tokenName,
                price,
                balances,
                userNFTs,
                stakeSummary,
                boostStatus,
                syncWeb3,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

const useUserData = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserData must be used within UserDataProvider");
    }
    return context;
};

export { UserDataProvider, useUserData };
