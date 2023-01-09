import { FC } from "react";

import { useUserData } from "../../../../context/UserContextProvider";
import styles from "../../../../styles/Staking.module.css";

const StakingRecap: FC<StakingRecapProps> = ({ totalReward }) => {
    const { tokenName, price, stakeSummary } = useUserData();

    return (
        <>
            <div className={styles.recap}>
                <div className={styles.mainText}>
                    Staking
                    <div className={styles.mainText} style={{ justifyContent: "flex-end" }}>
                        TVL: ${((Number(stakeSummary.total_amount) / 10 ** 18) * price).toFixed(2)}
                    </div>
                </div>
            </div>
            <div className={styles.recap} style={{ marginBottom: "30px" }}>
                <div className={styles.secondaryText}>
                    <div className={styles.secondaryText} style={{ justifyContent: "flex-end" }}>
                        Total Staked: {Number(stakeSummary.total_amount) / 10 ** 18} {tokenName} | Unclaimed Rewards:{" "}
                        {totalReward} {tokenName}
                    </div>
                </div>
            </div>{" "}
        </>
    );
};

export default StakingRecap;
