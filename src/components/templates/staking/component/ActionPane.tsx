import { FC, useState } from "react";
import AmountButton from "./AmountButton";
import WithdrawSingleModal from "./WithdrawSingleModal";
import { Button, InputNumber } from "antd";
import { useUserData } from "../../../../context/UserContextProvider";
import styles from "../../../../styles/Staking.module.css";
import { useStakeAction } from "../hooks";
import DetailsModal from "./DetailsModal";

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

    const onStakeMax = () => {
        setStakeAmount(Math.floor(Number(balances.token)));
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

                            <div className={styles.amountButton}>
                                <AmountButton
                                    buttonText={"max"}
                                    tokenBalance={balances.token}
                                    buttonFunction={onStakeMax}
                                />
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                type="primary"
                                className="button-colored-green-action"
                                onClick={() => handleStake(stakeAmount, lock)}
                            >
                                STAKE
                            </Button>
                        </div>
                    </>
                )}
                {id === "withdraw" && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            type="primary"
                            className="button-colored-green-action"
                            onClick={() => withdrawAll(deposited, lock)}
                        >
                            WITHDRAW ALL
                        </Button>
                    </div>
                )}

                {id === "withdraw" && lock !== 0 && (
                    <>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button
                                type="primary"
                                className="button-colored-green-action"
                                onClick={() => setWithdrawModal(true)}
                            >
                                WITHDRAW FROM STAKE
                            </Button>
                        </div>

                        <WithdrawSingleModal
                            open={withdrawModal}
                            setVisibility={setWithdrawModal}
                            deposited={deposited}
                            lock={lock}
                        />
                    </>
                )}
            </div>
            {id === "details" && (
                <Button type="primary" className="button-colored-green-action" onClick={() => setDetailModal(true)}>
                    DETAILS
                </Button>
            )}
            <DetailsModal lock={lock} deposited={deposited} open={detailModal} setVisibility={setDetailModal} />
        </div>
    );
};

export default ActionPane;
