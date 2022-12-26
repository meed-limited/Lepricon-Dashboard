import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { utils, BigNumber } from "ethers";
import NftBoostSelection from "./NftBoostSelection";
import ActionPane from "./ActionPane";
import DetailsModal from "./DetailsModal";
import { Button, message, Spin } from "antd";
import styles from "../../../../styles/Staking.module.css";
import { useUserData } from "../../../../context/UserContextProvider";
import useReadContract from "../../../../hooks/useReadContract";
import useWriteContract from "../../../../hooks/useWriteContract";

type StakingActionProps = {
    lock: number;
    setWaiting: Dispatch<SetStateAction<boolean>>;
    deposited: any;
};

const StakingAction: FC<StakingActionProps> = ({ lock, setWaiting, deposited }) => {
    const { address, balances, syncWeb3 } = useUserData();
    const { checkTokenAllowance } = useReadContract();
    const { approveToken, stake, unstake, loading } = useWriteContract();

    const [stakeAmount, setStakeAmount] = useState(0);
    const [selectedNFT, setSelectedNFT] = useState([]);
    const [visible, setVisibility] = useState(false);
    const [waitingInModal, setWaitingInModal] = useState(false);
    const decimals = 18;

    const openDetailsModal = () => {
        setVisibility(true);
    };

    const onChangeStakeAmount = (value: string) => {
        if (balances.token && balances.token !== 0) {
            if (parseFloat(value) > parseFloat(balances.token)) {
                setStakeAmount(parseFloat(balances.token));
            } else if (parseFloat(value) > 0 && parseFloat(value) <= parseFloat(balances.token)) {
                setStakeAmount(parseFloat(value));
            } else {
                setStakeAmount(0);
            }
        }
    };

    const onStakeMax = () => {
        if (balances.token) {
            setStakeAmount(Math.floor(balances.token));
        }
    };

    const checkAllowance = async (amount: string | BigNumber) => {
        const currentAllowance = await checkTokenAllowance();
        if (Number(currentAllowance) < Number(amount)) {
            await approveToken(amount);
        }
    };

    const handleStake = async () => {
        const stakeBN = utils.parseUnits(stakeAmount.toString(), decimals);
        checkAllowance(stakeBN)
            .then(() => {
                stake(stakeBN, lock).then(() => {
                    syncWeb3();
                });
            })
            .catch((err) => {
                console.log(err);
                setWaiting(false);
            });
    };

    const withdraw = async (stakeId: any, amount: { toString: () => string }) => {
        setWaitingInModal(true);
        const withdrawBN = utils.parseUnits(amount.toString(), decimals);
        await unstake(withdrawBN, stakeId).then(() => {
            setWaitingInModal(false);
            setTimeout(() => {
                window.location.reload();
            }, 10000);
        });
    };

    const withdrawAll = async () => {
        setWaiting(true);
        if (lock === 0) {
            for (let i = 0; i < deposited.stakes.stakes.length; i++) {
                const amount = deposited.stakes.stakes[i].amount;
                const amountBN = utils.parseUnits(amount.toString(), decimals);
                await unstake(amountBN, deposited.stakes.stakes[i].index);
            }
        } else {
            for (let i = 0; i < deposited.stakes.stakes.length; i++) {
                let stake = deposited.stakes.stakes[i];
                if (stake.unlockTime <= stake.since + stake.timeLock) {
                    const amount = stake.amount;
                    const amountBN = utils.parseUnits(amount.toString(), decimals);
                    await unstake(amountBN, stake.index);
                } else {
                    message.warning(
                        "No stakes to withdraw at this time. Please, check the locking time in the detail pane."
                    );
                    break;
                }
            }
        }
        setWaiting(false);
    };

    return (
        <div className={styles.actionContent}>
            {lock === 0 && (
                <Spin spinning={loading}>
                    {/* <NftBoostSelection
                        deposited={deposited}
                        selectedNFT={selectedNFT}
                        setSelectedNFT={setSelectedNFT}
                    /> */}
                </Spin>
            )}

            <div className={styles.dropDown}>
                <ActionPane
                    title={"Wallet Balance"}
                    max={balances.token}
                    buttonText={"STAKE"}
                    onAction={handleStake}
                    value={stakeAmount}
                    onMax={onStakeMax}
                    amount={onChangeStakeAmount}
                />
                <ActionPane
                    title={"Staked"}
                    max={deposited?.stakes.total}
                    buttonText={"WITHDRAW ALL"}
                    onAction={withdrawAll}
                    waitingInModal={waitingInModal}
                    deposited={deposited}
                    onAction2={withdraw}
                    lock={lock}
                />
                <div className={styles.actionItems}>
                    <div style={{ fontSize: "17px" }}>Show details per stake:</div>
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                        }}
                    >
                        <Button type="primary" id="button-colored-green-action" onClick={openDetailsModal}>
                            DETAILS
                        </Button>
                        <DetailsModal lock={lock} deposited={deposited} open={visible} setVisibility={setVisibility} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StakingAction;
