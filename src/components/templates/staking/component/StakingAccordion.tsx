import { FC, useEffect, useState } from "react";
import StakingAction from "./StakingAction";
import { CaretDownOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import l3p from "public/images/l3p.png";
import styles from "../../../../styles/Staking.module.css";
import { useUserData } from "../../../../context/UserContextProvider";
import { usePoolData } from "../hooks/usePoolData";
import Image from "next/image";

type StakingAccordionProps = {
    subTitle: string;
    deposited: StakesPerPool;
};

const StakingAccordion: FC<StakingAccordionProps> = ({ subTitle, deposited }) => {
    const { tokenName } = useUserData();
    const { text, lock, APR } = usePoolData(subTitle);
    const [action, setAction] = useState<boolean>(false);
    const [oldestStakeDate, setOldestStakeDate] = useState<number>();

    const reward = Number(deposited.reward.claimable + deposited.reward.locked).toFixed(2);

    const changeColorOnHover = (e: any) => {
        e.target.style.color = "#75e287";
    };

    const changeColorOnLeave = (e: any) => {
        e.target.style.color = "black";
    };

    const getDateFromBlock = async (deposited: StakesPerPool) => {
        if (deposited.stakes.stakes.length !== 0) {
            const timestamp = Math.floor(Date.now() / 1000);
            const since = parseInt(deposited.stakes.stakes[0].since);
            const date = Math.floor((timestamp - since) / (24 * 3600));
            setOldestStakeDate(date);
        }
    };

    useEffect(() => {
        if (deposited) {
            getDateFromBlock(deposited);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deposited]);

    return (
        <div className={styles.container}>
            <div className={styles.headline}>
                <div className={styles.leftContent}>
                    <Image src={l3p.src} alt="l3p logo" width={"40"} height={"40"} />
                    <div className={styles.l3pTimelock}>
                        <div>{tokenName}</div>
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
                            {deposited.stakes.total} {tokenName}
                        </div>
                        <div className={styles.accordeonItemsSub}>Deposited</div>
                    </div>
                    <div>
                        <div className={styles.accordeonItemsTop}>
                            {reward} {tokenName}
                        </div>
                        <div className={styles.accordeonItemsSub}>Unclaimed</div>
                    </div>
                    <div>
                        <div className={styles.accordeonItemsTop}>
                            {deposited.stakes.total !== 0 && oldestStakeDate !== undefined ? oldestStakeDate : "0"}
                        </div>
                        <div className={styles.accordeonItemsSub}>Daily</div>
                    </div>
                </div>
                <div className={styles.arrowDown}>
                    <CaretDownOutlined
                        className={styles.caretDownOutlined}
                        onClick={() => setAction((prev) => !prev)}
                        onMouseOver={changeColorOnHover}
                        onMouseOut={changeColorOnLeave}
                    />
                </div>
            </div>
            {action && <StakingAction lock={lock} deposited={deposited} />}
        </div>
    );
};

export default StakingAccordion;
