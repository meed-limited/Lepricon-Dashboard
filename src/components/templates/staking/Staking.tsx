import { FC } from "react";
import StakingAccordion from "./component/StakingAccordion";

import styles from "../../../styles/Staking.module.css";
import StakingRecap from "./component/StakingRecap";
import { Loading } from "../../elements";
import { useStakes } from "./hooks/useStakes";

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
