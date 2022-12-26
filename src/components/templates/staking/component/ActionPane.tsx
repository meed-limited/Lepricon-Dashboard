import { FC, useState } from "react";
import AmountButton from "./AmountButton";
import { BigNumber } from "ethers";
// import l3p from "../../../assets/l3p.png";
import WithdrawSingleModal from "./withdrawSingleModal";
import { Button, Input } from "antd";
import { useUserData } from "../../../../context/UserContextProvider";
import styles from "../../../../styles/Staking.module.css";

type ActionPaneProps = {
    title: string;
    max: number | BigNumber | string;
    buttonText: string;
    onAction: () => Promise<void>;
    value?: number;
    onMax?: () => void;
    amount?: (value: string) => void;
    waitingInModal?: boolean;
    deposited?: any;
    onAction2?: (
        stakeId: any,
        amount: {
            toString: () => string;
        }
    ) => Promise<void>;
    lock?: number;
};

const ActionPane: FC<ActionPaneProps> = ({
    lock,
    title,
    waitingInModal,
    deposited,
    amount,
    max,
    value,
    onMax,
    buttonText,
    onAction,
    onAction2,
}) => {
    const { balances, tokenName } = useUserData();
    const [visible, setVisibility] = useState(false);
    const [stakeToWithdrawFrom, setStakeToWithdrawFrom] = useState({});
    const [amountToWithdraw, setAmountToWithdraw] = useState();
    const [maxToWithdraw, setMaxToWithdraw] = useState();

    var options = {
        // id: undefined,
        label: undefined,
        value: undefined,
        // prefix: undefined,
    };

    const data =
        deposited?.stakes.stakes.length === 0
            ? options
            : deposited?.stakes.stakes.map(
                  (stake, id) =>
                      (options = {
                          // id: id,
                          label: `Id: ${id} - ${stake.amount} ${tokenName}`,
                          value: stake.amount,
                          // prefix: <img src={l3p} alt="l3p logo" width={"40px"} height={"40px"} />,
                      })
              );

    const exclude = title === "Wallet Balance" || (title === "Staked" && lock !== 0) ? true : false;

    const selectStakeToWithdraw = (value) => {
        let temp = {
            stakeId: value.id,
            amount: value.amount,
        };
        setStakeToWithdrawFrom(temp);
        setMaxToWithdraw(value.amount);
    };

    const onChangeWithdrawAmount = (value) => {
        if (lock !== 0) {
            if (stakeToWithdrawFrom && stakeToWithdrawFrom.amount > 0) {
                let maxAmount = stakeToWithdrawFrom.amount;
                if (parseFloat(value) > parseFloat(maxAmount)) {
                    setAmountToWithdraw(parseFloat(maxAmount));
                } else if (parseFloat(value) > 0 && parseFloat(value) <= parseFloat(maxAmount)) {
                    setAmountToWithdraw(parseFloat(value));
                } else {
                    setAmountToWithdraw(0);
                }
            }
        }
    };

    const onMaxSingle = () => {
        if (stakeToWithdrawFrom && stakeToWithdrawFrom.amount > 0) {
            setAmountToWithdraw(stakeToWithdrawFrom.amount);
        } else setAmountToWithdraw(0);
    };

    return (
        <>
            <div className={styles.items}>
                <div className={styles.actionHeader}>
                    <div style={{ justifyContent: "space-evenly" }}>{title}</div>
                    <div className={styles.amount}>
                        <div>
                            {(1 * max).toFixed(2)} {tokenName}
                        </div>
                    </div>
                </div>

                <div className={styles.subItems}>
                    {title === "Wallet Balance" && (
                        <>
                            <div style={{ width: "73%" }}>
                                <Input
                                    label={value !== 0 ? "" : "Enter amount"}
                                    id="input-action"
                                    onChange={(e) => amount(e.target.value)}
                                    type="number"
                                    validation={{
                                        numberMax: maxToWithdraw ?? 0,
                                        numberMin: 0,
                                    }}
                                    value={value}
                                />
                            </div>
                            <div className={styles.amountButton}>
                                <AmountButton buttonText={"max"} tokenBalance={balances.token} buttonFunction={onMax} />
                            </div>
                        </>
                    )}
                    {title === "Staked" && lock === 0 && (
                        <Button type="primary" id="button-colored-green-action" onClick={() => onAction()}>
                            {buttonText}
                        </Button>
                    )}

                    {title === "Staked" && lock !== 0 && (
                        <>
                            <Button type="primary" id="button-colored-green-action" onClick={() => setVisibility(true)}>
                                WITHDRAW FROM STAKE
                            </Button>

                            <WithdrawSingleModal
                                open={visible}
                                waitingInModal={waitingInModal}
                                setVisibility={setVisibility}
                                amountToWithdraw={amountToWithdraw}
                                onChangeWithdrawAmount={onChangeWithdrawAmount}
                                onMaxSingle={onMaxSingle}
                                selectStakeToWithdraw={selectStakeToWithdraw}
                                data={data}
                                stakeToWithdrawFrom={stakeToWithdrawFrom}
                                onAction2={onAction2}
                            />
                        </>
                    )}
                </div>
                {exclude && (
                    <Button type="primary" id="button-colored-green-action" onClick={() => onAction()}>
                        {buttonText}
                    </Button>
                )}
            </div>
        </>
    );
};

export default ActionPane;
