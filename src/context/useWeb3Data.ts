import { useCallback, useEffect, useState } from "react";

import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";
import { useAccount } from "wagmi";

// import { Nfts, StakingSummaryStructWithStatus, UserBalances, Web3Data } from "../../custom-types";
import { getContractAddresses, isProdEnv, LPR_TOKEN, TOKEN_TEST } from "../data/constants";
import useReadContract from "../hooks/useReadContract";
import { getStakeStatus } from "../utils/getStakeStatus";

export const useWeb3Data = (): Web3Data => {
    const { getCurrentStakes } = useReadContract();
    const [userBalances, setUserBalances] = useState<React.SetStateAction<UserBalances>>();
    const [userNFTs, setUserNFTs] = useState<React.SetStateAction<Nfts | undefined>>();
    const [stakes, setStakes] = useState<StakingSummaryStructWithStatus>();
    const { address } = useAccount();
    const account = address;
    const addresses = getContractAddresses();

    const MORALIS_API_KEY = process.env.REACT_APP_MORALIS_API_KEY;

    const fetchWeb3Data = async () => {
        const moralisChain = isProdEnv ? EvmChain.POLYGON : EvmChain.MUMBAI;

        // Start Moralis
        if (!Moralis.Core.isStarted) {
            await Moralis.start({
                apiKey: `${MORALIS_API_KEY}`,
            });
        }

        // Fetch user NFTs
        if (account) {
            const skins_NFT = await Moralis.EvmApi.nft.getWalletNFTs({
                address: account,
                chain: moralisChain,
                tokenAddresses: [addresses.nft],
            });
            const skins = { result: skins_NFT.raw.result, total: skins_NFT.raw.total };
            setUserNFTs(skins);

            // Fetch user native's balance
            const response_Native = await Moralis.EvmApi.balance.getNativeBalance({
                address: account,
                chain: moralisChain,
            });

            // Fetch user LPR's balance
            const response_LPR = await Moralis.EvmApi.token.getWalletTokenBalances({
                address: account,
                chain: moralisChain,
                tokenAddresses: isProdEnv ? [LPR_TOKEN] : [TOKEN_TEST],
            });

            setUserBalances({
                native: { balance: response_Native.raw.balance },
                token: response_LPR.raw[0],
            });
        }
    };

    const fetchStakes = async () => {
        const current = await getCurrentStakes(account as string);

        const userStakes = getStakeStatus(current!);
        setStakes(userStakes);
    };

    const syncWeb3 = useCallback(async () => {
        if (account) {
            await fetchWeb3Data();
            await fetchStakes();
        }
    }, [account]);

    useEffect(() => {
        syncWeb3();
    }, [account]);

    return {
        userBalances,
        userNFTs,
        stakes,
        syncWeb3,
    };
};
