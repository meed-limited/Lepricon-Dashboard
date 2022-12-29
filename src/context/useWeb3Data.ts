import { useCallback, useEffect, useState } from "react";

import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";
import { useAccount } from "wagmi";

import { useReadContract } from "../hooks";
import { getContractAddresses, isProdEnv } from "../data/constant";
import { LepriconStaking } from "../../hardhat/typechain-types";
import { ethers } from "ethers";

export const useWeb3Data = (): Web3Data => {
    const { address } = useAccount();
    const { nft } = getContractAddresses();
    const { getTokenName, getTokenBalance, getStakes, getBoost } = useReadContract();

    const [tokenName, setTokenName] = useState<string>("");

    const [balances, setBalances] = useState<UserBalances>({ native: "0", token: "0" });
    const [stakeSummary, setStakeSummary] = useState<LepriconStaking.StakingSummaryStructOutput>();
    const [boostStatus, setBoostStatus] = useState<BoostStatusExtended>();
    const [userNFTs, setUserNFTs] = useState<Nfts>({ result: [], total: 0 });

    const fetchGlobalData = useCallback(async () => {
        const name = await getTokenName();
        setTokenName(name);
    }, [getTokenName]);

    useEffect(() => {
        fetchGlobalData();
    }, [fetchGlobalData]);

    const fetchMoralisData = async () => {
        const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
        const moralisChain = isProdEnv ? EvmChain.ETHEREUM : EvmChain.GOERLI;

        // Start Moralis
        if (!Moralis.Core.isStarted) {
            await Moralis.start({
                apiKey: `${MORALIS_API_KEY}`,
            });
        }

        if (address) {
            // Fetch user NFTs
            const tx = await Moralis.EvmApi.nft.getWalletNFTs({
                address: address,
                chain: moralisChain,
                tokenAddresses: [nft],
            });
            const userNfts = { result: tx.raw.result, total: tx.raw.total };
            setUserNFTs(userNfts);

            // Fetch user native's balance
            const response_Native = await Moralis.EvmApi.balance.getNativeBalance({
                address: address,
                chain: moralisChain,
            });

            // Fetch user token's balance
            const tokenBalance = await getTokenBalance();

            setBalances({
                native: response_Native.raw.balance,
                token: ethers.utils.formatEther(tokenBalance),
            });
        }
    };

    const fetchStakingData = async () => {
        const stakeData = await getStakes();
        setStakeSummary(stakeData);

        const boostData = await getBoost();
        if (boostData) {
            const temp: BoostStatusExtended = {
                isBoost: boostData.isBoost,
                NftContractAddress: boostData.NftContractAddress,
                tokenId: Number(boostData.tokenId),
                boostValue: Number(boostData.boostValue),
                sinceTimeStamp: Number(boostData.since),
                sinceDate: new Date(Number(boostData.since) * 1000),
            };
            setBoostStatus(temp);
        }
    };

    const syncWeb3 = useCallback(() => {
        if (address) {
            fetchMoralisData();
            fetchStakingData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    useEffect(() => {
        if (address) {
            syncWeb3();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address]);

    return {
        tokenName,
        balances,
        userNFTs,
        stakeSummary,
        boostStatus,
        syncWeb3,
    };
};
