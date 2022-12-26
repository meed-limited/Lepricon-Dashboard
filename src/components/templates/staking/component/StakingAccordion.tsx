import { FC, useEffect, useState } from "react";
import StakingAction from "./StakingAction";
import { Spin } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import l3p from "public/images/l3p.png";
import styles from "../../../../styles/Staking.module.css";
import { useUserData } from "../../../../context/UserContextProvider";
import { usePoolData } from "../../../../hooks/usePoolData";
import Image from "next/image";

type StakingAccordionProps = {
    subTitle: string;
    deposited: any;
};

const StakingAccordion: FC<StakingAccordionProps> = ({ subTitle, deposited }) => {
    const { tokenName } = useUserData();
    const { text, lock, APR } = usePoolData(subTitle);
    const [waiting, setWaiting] = useState<boolean>(false);
    const [action, setAction] = useState<boolean>(false);
    const [oldestStakeDate, setOldestStakeDate] = useState<number>();

    const getDateFromBlock = async (deposited: StakesPerPool) => {
        if (deposited.stakes.stakes.length !== 0) {
            const since = deposited.stakes.stakes[0]?.since;
            const timestamp = Math.floor(Date.now() / 1000);
            var date = timestamp - parseInt(since);
            date = Math.floor(date / (24 * 3600));
            setOldestStakeDate(date);
        }
    };

    useEffect(() => {
        if (deposited !== undefined) {
            getDateFromBlock(deposited);
        }
        return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deposited]);

    const displayAction = () => {
        setAction((prev) => !prev);
    };

    const changeColorOnHover = (e: any) => {
        e.target.style.color = "#75e287";
    };

    const changeColorOnLeave = (e: any) => {
        e.target.style.color = "black";
    };

    const displayReward = () => {
        const noLockReward = deposited?.reward === 0 ? 0 : parseFloat(deposited?.reward).toFixed(3);
        const lockedReward =
            deposited?.reward.claimable + deposited?.reward.locked === 0
                ? 0
                : parseFloat(deposited?.reward.claimable + deposited?.reward.locked).toFixed(3);

        return (
            <>
                {subTitle === "noLock" && noLockReward}
                {subTitle !== "noLock" && lockedReward}
            </>
        );
    };

    return (
        <Spin style={{ borderRadius: "20px" }} spinning={waiting} size="large">
            <div className={styles.container}>
                <div className={styles.headline}>
                    <div className={styles.leftContent}>
                        <Image src={l3p.src} alt="l3p logo" width={"40"} height={"40"} />
                        <div className={styles.l3pTimelock}>
                            <h4>{tokenName}</h4>
                            <Text style={{ fontSize: "15px" }}>{text}</Text>
                        </div>
                    </div>

                    <div className={styles.accordeonItems}>
                        <div>
                            <div className={styles.accordeonItemsTop}>{APR}%</div>
                            <div className={styles.accordeonItemsSub}>APR</div>
                        </div>
                        <div>
                            <div className={styles.accordeonItemsTop}>
                                {deposited?.stakes.total} {tokenName}
                            </div>
                            <div className={styles.accordeonItemsSub}>Deposited</div>
                        </div>
                        <div>
                            <div className={styles.accordeonItemsTop}>
                                {displayReward()} {tokenName}
                            </div>
                            <div className={styles.accordeonItemsSub}>Unclaimed</div>
                        </div>
                        <div>
                            <div className={styles.accordeonItemsTop}>
                                {deposited?.stakes.total !== 0 && oldestStakeDate !== undefined ? oldestStakeDate : "0"}
                            </div>
                            <div className={styles.accordeonItemsSub}>Daily</div>
                        </div>
                    </div>
                    <div className={styles.arrowDown}>
                        <CaretDownOutlined
                            className={styles.caretDownOutlined}
                            onClick={displayAction}
                            onMouseOver={changeColorOnHover}
                            onMouseOut={changeColorOnLeave}
                        />
                    </div>
                </div>
                {action && <StakingAction lock={lock} setWaiting={setWaiting} deposited={deposited} />}
            </div>
        </Spin>
    );
};

export default StakingAccordion;
