import React, { FC, ReactNode, useContext, useMemo, useState } from "react";

import { useAccount, useNetwork } from "wagmi";

import UserContext from "./context";
import { useWeb3Data } from "./useWeb3Data";

type Props = {
    children: ReactNode;
};

const UserDataProvider: FC<Props> = ({ children }) => {
    const { address, isConnected } = useAccount();
    const { chain } = useNetwork();
    const chainId: number | undefined = chain !== undefined ? chain.id : undefined;
    const { userBalances, userNFTs, stakes, syncWeb3 }: Web3Data = useWeb3Data();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <UserContext.Provider
            value={{
                address,
                chainId,
                isConnected,
                userBalances,
                userNFTs,
                stakes,
                syncWeb3,
                isMenuOpen,
                setIsMenuOpen,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

const useUserData: any = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserData must be used within UserDataProvider");
    }
    return context;
};

export { UserDataProvider, useUserData };
