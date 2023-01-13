import { useCallback, useEffect, useState } from "react";

import { ethers } from "ethers";
import { useAccount } from "wagmi";

import { LepriconStaking } from "../../types/LepriconStaking";
import { getContractAddresses, URL } from "../data/constant";
import { useReadContract } from "../hooks";

export const useWeb3Data = (): Web3Data => {
    const { address } = useAccount();
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
        const res: Response = await fetch(`${URL}api/getMoralisData`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                account: address,
            }),
        });
        const data = await res.json();
        setUserNFTs(data.data.userNfts);

        // Fetch user token's balance
        const tokenBalance = await getTokenBalance();

        setBalances({
            native: data.data.nativeBalance,
            token: ethers.utils.formatEther(tokenBalance),
        });
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
