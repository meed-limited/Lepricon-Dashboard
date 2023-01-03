import { Button } from "antd";
import { FC } from "react";
import { useAccount } from "wagmi";

import { isProdEnv } from "../../../data/constant";
import { mumbai, polygon } from "../../../data/networks";
import { useSuportedChains } from "../../../hooks";
import styles from "../../../styles/ChainVerification.module.css";

const ChainVerification: FC = () => {
    const { isConnected } = useAccount();
    const isSupportedChain = useSuportedChains();

    const handleSwitch = async () => {
        try {
            if (window.ethereum) {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: isProdEnv ? [{ chainId: "0x89" }] : [{ chainId: "0x13881" }],
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            {isConnected && !isSupportedChain && (
                <div className={styles.content}>
                    <span className={styles.text}>
                        Wrong network. Please switch to {isProdEnv ? polygon.name : mumbai.name}.
                    </span>
                    <Button type="primary" onClick={() => handleSwitch()}>
                        Switch Network
                    </Button>
                </div>
            )}
        </>
    );
};

export default ChainVerification;
