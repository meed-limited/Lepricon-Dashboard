import { FC } from "react";

import { Spin } from "antd";

import { useUserData } from "../../../../context/UserContextProvider";
import styles from "../../../../styles/Staking.module.css";
import { useStakeAction } from "../hooks";
import ActionPane from "./ActionPane";
import NftBoostSelection from "./NftBoostSelection";

const StakingAction: FC<StakingActionProps> = ({ lock, deposited }) => {
    const { balances } = useUserData();
    const { loading } = useStakeAction();

    return (
        <Spin spinning={loading} size="large" style={{ borderRadius: "20px" }}>
            <div className={styles.actionContent}>
                {lock === 0 && <NftBoostSelection deposited={deposited} />}

                <div className={styles.dropDown}>
                    <ActionPane
                        id="stake"
                        title={"Wallet Balance"}
                        max={balances.token}
                        lock={lock}
                        deposited={deposited}
                    />
                    <ActionPane
                        id="withdraw"
                        title={"Staked"}
                        max={deposited.stakes.total}
                        lock={lock}
                        deposited={deposited}
                    />
                    <ActionPane
                        id="details"
                        title={"Details per stake"}
                        max={deposited.stakes.total}
                        lock={lock}
                        deposited={deposited}
                    />
                </div>
            </div>
        </Spin>
    );
};

export default StakingAction;
