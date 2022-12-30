import { FC, useState } from "react";
import WithdrawSingleModal from "./WithdrawSingleModal";
import { InputNumber } from "antd";
import { useUserData } from "../../../../context/UserContextProvider";
import styles from "../../../../styles/Staking.module.css";
import { useStakeAction } from "../hooks";
import DetailsModal from "./DetailsModal";
import { ButtonAction, ButtonMax } from "../../../elements/Buttons";

type ActionPaneProps = {
    id: string;
    title: string;
    max: number | string;
    lock: number;
    deposited: StakesPerPool;
};

const ActionPane: FC<ActionPaneProps> = ({ id, lock, title, deposited, max }) => {
    const { balances, tokenName } = useUserData();
    const { handleStake, withdrawAll } = useStakeAction();
    const [stakeAmount, setStakeAmount] = useState(0);
    const [withdrawModal, setWithdrawModal] = useState<boolean>(false);
    const [detailModal, setDetailModal] = useState<boolean>(false);

    const onChangeStakeAmount = (value: number) => {
        if (Number(balances.token) !== 0) {
            if (value > parseFloat(balances.token)) {
                setStakeAmount(parseFloat(balances.token));
            } else if (value > 0 && value <= parseFloat(balances.token)) {
                setStakeAmount(value);
            } else {
                setStakeAmount(0);
            }
        }
    };

    return (
        <div className={styles.items}>
            <div className={styles.actionHeader}>
                <div style={{ justifyContent: id === "details" ? "center" : "space-evenly" }}>{title}</div>
                {id !== "details" && (
                    <div className={styles.amount}>
                        {Number(max).toFixed(2)} {tokenName}
                    </div>
                )}
            </div>

            <div className={styles.subItems}>
                {id === "stake" && (
                    <>
                        <div style={{ display: "inline-flex" }}>
                            <InputNumber
                                defaultValue={0}
                                onChange={(value) => onChangeStakeAmount(value ?? 0)}
                                max={Number(balances.token)}
                                min={0}
                                value={stakeAmount}
                                style={{ width: "73%" }}
                            />

                            <ButtonMax amount={balances.token} action={setStakeAmount} />
                        </div>
                        <div className={styles.actionButton}>
                            <ButtonAction title="STAKE" action={() => handleStake(stakeAmount, lock)} />
                        </div>
                    </>
                )}
                {id === "withdraw" && (
                    <div className={styles.actionButton}>
                        <ButtonAction title="WITHDRAW ALL" action={() => withdrawAll(deposited, lock)} />
                    </div>
                )}

                {id === "withdraw" && lock !== 0 && (
                    <div className={styles.actionButton}>
                        <ButtonAction title="WITHDRAW FROM STAKE" action={() => setWithdrawModal(true)} />
                    </div>
                )}
            </div>
            {id === "details" && <ButtonAction title="DETAILS" action={() => setDetailModal(true)} />}

            <DetailsModal lock={lock} deposited={deposited} open={detailModal} setVisibility={setDetailModal} />
            <WithdrawSingleModal
                open={withdrawModal}
                setVisibility={setWithdrawModal}
                deposited={deposited}
                lock={lock}
            />
        </div>
    );
};

export default ActionPane;
