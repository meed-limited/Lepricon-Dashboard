import { useCallback, useEffect, useState } from "react";

import { useAccount } from "wagmi";
import { useReadContract } from "../../../../hooks";

export const usePoolData = (pool: string) => {
    const { isConnected } = useAccount();
    const { getVaultForTimelock } = useReadContract();

    const [text, setText] = useState<string>("");
    const [lock, setLock] = useState<number>(0);
    const [APR, setAPR] = useState<number>(0);

    const getPoolAPR = useCallback(
        async (vaultIndex: number) => {
            let vault = await getVaultForTimelock(vaultIndex);
            if (vault) {
                setAPR(vault.apr);
            }
        },
        [getVaultForTimelock]
    );

    useEffect(() => {
        if (pool === "noLock") {
            setText("Unstake Anytime");
            setLock(0);
            if (isConnected) {
                getPoolAPR(0);
            }
        } else if (pool === "3months") {
            setText("3 months lock");
            setLock(3);
            if (isConnected) {
                getPoolAPR(1);
            }
        } else if (pool === "6months") {
            setText("6 months lock");
            setLock(6);
            if (isConnected) {
                getPoolAPR(2);
            }
        } else if (pool === "12months") {
            setText("12 months lock");
            setLock(12);
            if (isConnected) {
                getPoolAPR(3);
            }
        }
        return;
    }, [isConnected, pool, getPoolAPR]);

    return { text, lock, APR };
};
