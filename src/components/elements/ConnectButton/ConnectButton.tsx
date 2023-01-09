import { FC, useState } from "react";

import { Button } from "antd";
import { useAccount } from "wagmi";

import styles from "../../../styles/ConnectButton.module.css";
import { getEllipsisTxt } from "../../../utils/format";
import ConnectModal from "./ConnectModal";
import DisconnectModal from "./DisconnectModal";
import Jazzicons from "./Jazzicons";

const ConnectButton: FC = () => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isDisconnectModalVisible, setIsDisconnectModalVisible] = useState<boolean>(false);
    const { connector: isConnected, address } = useAccount();

    const handleModal = () => setIsModalVisible((prev) => !prev);

    const handleDisconnectModal = () => setIsDisconnectModalVisible((prev) => !prev);

    return (
        <>
            {!isConnected ? (
                <>
                    <Button className={styles.connectButton} onClick={handleModal}>
                        Connect Wallet
                    </Button>
                    <ConnectModal isOpen={isModalVisible} setIsOpen={setIsModalVisible} />
                </>
            ) : (
                <>
                    <Button className={styles.connectedAddress} onClick={handleDisconnectModal}>
                        {address && typeof address === "string" && (
                            <p className={styles.connectedAddressText}>{getEllipsisTxt(address, 5)}</p>
                        )}
                        <Jazzicons seed={address as string} />
                    </Button>

                    <DisconnectModal isOpen={isDisconnectModalVisible} onClose={setIsDisconnectModalVisible} />
                </>
            )}
        </>
    );
};

export default ConnectButton;
