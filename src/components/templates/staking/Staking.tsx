import { FC, useEffect, useState } from "react";
import StakingAccordion from "./component/StakingAccordion";
import { rewardPerUser, getDetailPerUser, validStakePerPool } from "../../../utils/getStakesInfo";
// import { useCoingeckoAPI } from "hooks/useCoingeckoAPI";
import { Spin } from "antd";
import styles from "../../../styles/Staking.module.css";
import { useUserData } from "../../../context/UserContextProvider";

const Staking: FC = () => {
    const { isConnected, tokenName, price, stakeSummary } = useUserData();
    // const { price } = useCoingeckoAPI();
    const [loading, setLoading] = useState(true);
    const [userStakes, setUserStakes] = useState<DetailPerUser>();
    const [stakesPerPool, setStakesPerPool] = useState<SortedStakes>();
    const [totalReward, setTotalReward] = useState<number>(0);

    console.log("stakeSummary", stakeSummary);

    useEffect(() => {
        if (!stakeSummary) {
            setLoading(true);
        } else {
            detailPerUser();
            setLoading(false);
        }
        return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stakeSummary]);

    const detailPerUser = () => {
        const details = getDetailPerUser(stakeSummary.stakes);
        setUserStakes(details);
    };

    const perPool = (details: DetailPerUser, lock: number) => {
        return { stakes: validStakePerPool(details, lock), reward: rewardPerUser(details, lock) };
    };

    useEffect(() => {
        if (userStakes) {
            let temp0 = perPool(userStakes, 0);
            let temp1 = perPool(userStakes, 3);
            let temp2 = perPool(userStakes, 6);
            let temp3 = perPool(userStakes, 12);

            const stakesPerPool = {
                no_lock: temp0,
                three: temp1,
                six: temp2,
                twelve: temp3,
            };

            const allRewards = Number((userStakes.reward.total.claimable + userStakes.reward.total.locked).toFixed(4));
            console.log("allRewards", allRewards);

            setTotalReward(allRewards ? allRewards : 0);
            setStakesPerPool(stakesPerPool);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userStakes]);

    return (
        <div className={styles.content}>
            {isConnected && loading ? (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Spin size="large" tip="Loading..." />
                </div>
            ) : (
                <>
                    <div className={styles.recap}>
                        <div className={styles.mainText}>
                            Staking
                            <div className={styles.mainText} style={{ justifyContent: "flex-end" }}>
                                TVL: ${(Number(stakeSummary?.totalAmount) * price).toFixed(2)}
                            </div>
                        </div>
                    </div>
                    <div className={styles.recap} style={{ marginBottom: "30px" }}>
                        <div className={styles.secondaryText}>
                            <div className={styles.secondaryText} style={{ justifyContent: "flex-end" }}>
                                Total Staked: {stakeSummary?.totalAmount} {tokenName} | Unclaimed Rewards: {totalReward}{" "}
                                {tokenName}
                            </div>
                        </div>
                    </div>

                    <div className={styles.stakePane}>
                        <StakingAccordion subTitle={"noLock"} deposited={stakesPerPool?.no_lock} />
                        <StakingAccordion subTitle={"3months"} deposited={stakesPerPool?.three} />
                        <StakingAccordion subTitle={"6months"} deposited={stakesPerPool?.six} />
                        <StakingAccordion subTitle={"12months"} deposited={stakesPerPool?.twelve} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Staking;
