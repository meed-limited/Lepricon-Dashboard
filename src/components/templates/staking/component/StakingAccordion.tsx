import { FC, useEffect, useState } from "react";
import StakingAction from "./StakingAction";
import { CaretDownOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import l3p from "public/images/l3p.png";
import styles from "../../../../styles/Staking.module.css";
import { useUserData } from "../../../../context/UserContextProvider";
import { usePoolData } from "../hooks";
import Image from "next/image";
import { useWindowWidthAndHeight } from "../../../../hooks";
import { Divider } from "antd";
import AccordionData from "./AccordionData";

type StakingAccordionProps = {
    subTitle: string;
    deposited: StakesPerPool;
};

const StakingAccordion: FC<StakingAccordionProps> = ({ subTitle, deposited }) => {
    const { tokenName } = useUserData();
    const { isMobile } = useWindowWidthAndHeight();
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
        getDateFromBlock(deposited);
    }, [deposited]);

    const displayAPR = `${APR}%`;
    const totalDepot = `${deposited.stakes.total} ${tokenName}`;
    const totalReward = `${reward} ${tokenName}`;
    const days = `${deposited.stakes.total !== 0 && oldestStakeDate !== undefined ? oldestStakeDate : "0"}`;

    return (
        <div className={styles.container}>
            <div className={styles.headline}>
                <div className={styles.leftContent} style={{ width: isMobile ? "100%" : "25%" }}>
                    <Image src={l3p.src} alt="l3p logo" width={"40"} height={"40"} />
                    <div className={styles.l3pTimelock} style={{ margin: isMobile ? "auto" : "none" }}>
                        <div>{tokenName}</div>
                        <Text style={{ fontSize: "15px" }}>{text}</Text>
                    </div>
                </div>
                {!isMobile && (
                    <div className={styles.accordeonItems}>
                        <AccordionData title="APR" data={displayAPR} />
                        <AccordionData title="Deposited" data={totalDepot} />
                        <AccordionData title="Unclaimed" data={totalReward} />
                        <AccordionData title="Days" data={days} />
                    </div>
                )}

                <div className={styles.arrowDown}>
                    <CaretDownOutlined
                        className={styles.caretDownOutlined}
                        onClick={() => setAction((prev) => !prev)}
                        onMouseOver={changeColorOnHover}
                        onMouseOut={changeColorOnLeave}
                    />
                </div>
            </div>
            {isMobile && (
                <>
                    <Divider style={{ marginBlock: "0 10px" }} />
                    <div className={styles.accordeonItemsMobile}>
                        <AccordionData title="APR" data={displayAPR} />
                        <AccordionData title="Deposited" data={totalDepot} />
                        <AccordionData title="Unclaimed" data={totalReward} />
                        <AccordionData title="Days" data={days} />
                    </div>
                </>
            )}
            {action && <StakingAction lock={lock} deposited={deposited} />}
        </div>
    );
};

export default StakingAccordion;
