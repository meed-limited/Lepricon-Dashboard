import { useState } from "react";

import { message } from "antd";
import { utils, BigNumber } from "ethers";

import { useUserData } from "../../../../context/UserContextProvider";
import { useReadContract, useWriteContract } from "../../../../hooks";

export const useStakeAction = () => {
    const { syncWeb3 } = useUserData();
    const { checkTokenAllowance } = useReadContract();
    const { stake, approveToken, unstake } = useWriteContract();
    const [loading, setLoading] = useState<boolean>(false);

    const checkAllowance = async (amount: string | BigNumber) => {
        setLoading(true);
        const currentAllowance = await checkTokenAllowance();
        if (Number(currentAllowance) < Number(amount)) {
            await approveToken(amount).then(() => setLoading(false));
        }
        setLoading(false);
    };

    const handleStake = async (amount: number, lock: number) => {
        setLoading(true);
        const stakeBN = utils.parseUnits(amount.toString(), 18);
        checkAllowance(stakeBN)
            .then(() => {
                stake(stakeBN, lock).then(() => {
                    syncWeb3();
                    setLoading(false);
                });
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const withdraw = async (id: number, amount: number) => {
        setLoading(true);
        const amountToBN = utils.parseUnits(amount.toString(), 18);
        await unstake(amountToBN, id)
            .then(() => {
                syncWeb3();
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const withdrawAll = async (deposited: StakesPerPool, lock: number) => {
        setLoading(true);
        if (lock === 0) {
            for (let i = 0; i < deposited.stakes.stakes.length; i++) {
                const amount = deposited.stakes.stakes[i].amount;
                const amountBN = utils.parseUnits(amount.toString(), 18);
                await unstake(amountBN, deposited.stakes.stakes[i].index);
                setLoading(false);
                syncWeb3();
            }
        } else {
            for (let i = 0; i < deposited.stakes.stakes.length; i++) {
                const stake = deposited.stakes.stakes[i];
                if (stake.unlockTime <= Number(stake.since) + stake.timeLock) {
                    const amount = stake.amount;
                    const amountBN = utils.parseUnits(amount.toString(), 18);
                    await unstake(amountBN, stake.index);
                    setLoading(false);
                    syncWeb3();
                } else return "No stakes to withdraw at this time. Please, check the locking time in the detail pane.";
                message.warning("");
                setLoading(false);
                break;
            }
        }
    };

    return { handleStake, withdraw, withdrawAll, loading };
};
