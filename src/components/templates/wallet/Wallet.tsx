import { FC } from "react";

import { Divider } from "antd";
import Image from "next/image";

import polygon_img from "/public/images/polygon_img.png";

import { useUserData } from "../../../context/UserContextProvider";
import { DEX_URL } from "../../../data/constant";
import styles from "../../../styles/Wallet.module.css";
import { DisplayNft } from "../../elements";
import { WalletData } from "./component";

const Wallet: FC = () => {
    const { tokenName, balances, price, stakeSummary } = useUserData();

    const available = Number(balances.token);
    const staked = Number(stakeSummary?.total_amount) / 10 ** 18;

    return (
        <div className="content">
            <div className="box">
                <div className="title">Lepricon Tokens:</div>
                <Divider />

                <div className={styles.subDiv}>
                    <div className={styles.container}>
                        <div className={styles.chainLogo}>
                            <Image src={polygon_img.src} alt="Chain logo" width={"220"} height={"70"} />
                        </div>
                        <WalletData
                            title="Available"
                            value={available}
                            price={price}
                            tokenName={tokenName}
                            link={DEX_URL}
                        />
                        <WalletData
                            title="Staked"
                            value={staked}
                            price={price}
                            tokenName={tokenName}
                            link={"/staking"}
                        />
                        {/* <WalletData title="Liquidity Provided" value={0} price={price} tokenName={tokenName} link={"/pool"} /> */}
                        <Divider />
                        <WalletData
                            title="Total"
                            value={available + staked}
                            price={price}
                            tokenName={tokenName}
                            link={null}
                        />
                    </div>
                </div>
            </div>
            <div className="box">
                <div className="title">Lepricon NFTs:</div>
                <Divider />

                <DisplayNft selectable={false} />
            </div>
        </div>
    );
};

export default Wallet;
