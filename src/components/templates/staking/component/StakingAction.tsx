import { FC, useState } from "react";
import NftBoostSelection from "./NftBoostSelection";
import ActionPane from "./ActionPane";
import styles from "../../../../styles/Staking.module.css";
import { useUserData } from "../../../../context/UserContextProvider";
import { useStakeAction } from "../hooks/useStakeAction";
import { Spin } from "antd";

type StakingActionProps = {
    lock: number;
    deposited: StakesPerPool;
};

const StakingAction: FC<StakingActionProps> = ({ lock, deposited }) => {
    const { balances } = useUserData();
    const { loading } = useStakeAction();
    const [selectedNFT, setSelectedNFT] = useState([]);

    return (
        <Spin spinning={loading} size="large" style={{ borderRadius: "20px" }}>
            <div className={styles.actionContent}>
                {lock === 0 && (
                    <></>
                    //      <NftBoostSelection
                    //      deposited={deposited}
                    //      selectedNFT={selectedNFT}
                    //      setSelectedNFT={setSelectedNFT}
                    //  />
                )}

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
