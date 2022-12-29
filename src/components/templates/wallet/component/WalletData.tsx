import { FC } from "react";
import LinkButton from "./LinkButton";

import styles from "../../../../styles/Wallet.module.css";

const WalletData: FC<WalletDataProps> = ({ title, value, price, tokenName, link }) => {
    return (
        <div className={styles.item} style={{ paddingBottom: "10px" }}>
            <div style={{ justifyContent: "flex-start" }}>{title}:</div>
            <div className={styles.item} style={{ justifyContent: "flex-end", flex: "1" }}>
                <div className={styles.itemValue} style={{ paddingRight: title === "Total" ? "30px" : 0 }}>
                    <div>
                        {value.toFixed(2)} {tokenName}
                    </div>
                    <div className={styles.priceText}>${(price * value).toFixed(2)}</div>
                </div>
                <LinkButton title={title} link={link} />
            </div>
        </div>
    );
};

export default WalletData;
