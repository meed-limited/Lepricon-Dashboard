import { Dispatch, FC, SetStateAction, useState } from "react";

import { Divider, InputNumber, Modal, Select, Spin } from "antd";
import Image from "next/image";

import { useUserData } from "../../../../context/UserContextProvider";
import styles from "../../../../styles/Staking.module.css";
import { ButtonAction, ButtonMax } from "../../../elements/Buttons";
import { useStakeAction } from "../hooks";

import l3p from "/public/images/l3p.png";

type WithdrawSingleModalProps = {
    open: boolean;
    setVisibility: Dispatch<SetStateAction<boolean>>;
    deposited: StakesPerPool;
    lock: number;
};

const WithdrawSingleModal: FC<WithdrawSingleModalProps> = ({ open, setVisibility, deposited, lock }) => {
    const { tokenName } = useUserData();
    const { loading } = useStakeAction();
    const { withdraw } = useStakeAction();
    const [selectedStake, setSelectedStake] = useState<StakeToWithdrawFrom>({ stakeId: 0, amount: 0 });
    const [amountToWithdraw, setAmountToWithdraw] = useState<number>(0);

    const handleCancel = () => {
        setVisibility(false);
    };

    const handleChange = (value: { value: string; key: number; label: React.ReactNode }) => {
        setSelectedStake({ stakeId: Number(value.key), amount: Number(value.value) });
    };

    const onChangeWithdrawAmount = (value: number) => {
        if (lock !== 0) {
            if (selectedStake.amount > 0) {
                const maxAmount = selectedStake.amount;
                if (value > parseFloat(maxAmount)) {
                    setAmountToWithdraw(parseFloat(maxAmount));
                } else if (value > 0 && value <= parseFloat(maxAmount)) {
                    setAmountToWithdraw(value);
                } else {
                    setAmountToWithdraw(0);
                }
            }
        }
    };

    const labelToShow = (id: number, amount: number) => {
        return (
            <div style={{ display: "inline-flex", alignItems: "center" }}>
                <Image src={l3p.src} alt={"l3p logo"} width={"25"} height={"25"} style={{ marginRight: "15px" }} />
                <span>
                    Id: {id} | Amount: {amount} {tokenName}
                </span>
            </div>
        );
    };

    const data =
        deposited.stakes.stakes.length === 0
            ? undefined
            : deposited.stakes.stakes.map((stake) => {
                  return {
                      label: labelToShow(stake.index, stake.amount),
                      key: stake.index,
                      value: stake.amount,
                  };
              });

    return (
        <Modal open={open} footer={null} wrapClassName="modalStyle" onCancel={handleCancel} width={450}>
            <span className="modal_title">Select the stake and the amount to withdraw:</span>
            <Spin spinning={loading} size="large">
                <div className={styles.modalContainer}>
                    <label>1. Pick the stake to withdraw from:</label>
                    <div className={styles.content1}>
                        <Select
                            labelInValue
                            optionLabelProp="label"
                            placeholder="Select stake Id"
                            onChange={handleChange}
                            style={{ width: "80%" }}
                            options={data}
                        />
                    </div>

                    <label>2. Enter the amount to withdraw:</label>
                    <div className={styles.content2}>
                        <InputNumber
                            defaultValue={0}
                            onChange={(value) => onChangeWithdrawAmount(value)}
                            max={selectedStake?.amount ?? 0}
                            min={0}
                            value={amountToWithdraw}
                            style={{ width: "175px" }}
                        />

                        <ButtonMax amount={selectedStake.amount} action={setAmountToWithdraw} />
                    </div>
                    <Divider />
                    <div className={styles.withdrawButton}>
                        <ButtonAction
                            title="WITHDRAW"
                            action={() => withdraw(selectedStake?.stakeId ?? 0, amountToWithdraw)}
                        />
                    </div>
                </div>
            </Spin>
        </Modal>
    );
};

export default WithdrawSingleModal;
