import { FC } from "react";

import { StakingAccordion, StakingRecap } from "./component";
import { useStakes } from "./hooks";
import styles from "../../../styles/Staking.module.css";
import { Loading } from "../../elements";

const Staking: FC = () => {
    const { stakesPerPool, totalReward, initialLoading } = useStakes();

    return (
        <div className={styles.content}>
            {initialLoading ? (
                <Loading />
            ) : (
                <>
                    <StakingRecap totalReward={totalReward} />
                    <div className={styles.stakePane}>
                        <StakingAccordion subTitle={"noLock"} deposited={stakesPerPool.no_lock} />
                        <StakingAccordion subTitle={"3months"} deposited={stakesPerPool.three} />
                        <StakingAccordion subTitle={"6months"} deposited={stakesPerPool.six} />
                        <StakingAccordion subTitle={"12months"} deposited={stakesPerPool.twelve} />
                    </div>
                </>
            )}
        </div>
    );
};

export default Staking;
