import { FC, useState } from "react";

import { CloseOutlined } from "@ant-design/icons";
import { Alert, Button, Divider, Modal, Spin } from "antd";

import { useUserData } from "../../../../context/UserContextProvider";
import { useWindowWidthAndHeight } from "../../../../hooks";
import styles from "../../../../styles/Staking.module.css";
import { getBoostAttributes } from "../../../../utils/getNftAttributes";
import { DisplayNft, ButtonAction } from "../../../elements";
import { useBoostAction } from "../hooks/useBoostAction";

const NftBoostSelection: FC<NftBoostSelectionProps> = ({ deposited }) => {
    const { boostStatus } = useUserData();
    const { applyNFTboost, removeNftBoost, loading } = useBoostAction();
    const { isMobile } = useWindowWidthAndHeight();
    const [selectedNFT, setSelectedNFT] = useState<Nft>();
    const [visible, setVisibility] = useState(false);

    const handleSelectNft = (nft: Nft) => {
        setSelectedNFT(nft);
        setVisibility(false);
    };

    const getDate = (timestamp: number) => {
        const datetime = new Date(timestamp * 1000);
        const date = (
            <>
                {datetime.getDate()}/{datetime.getMonth() + 1}/{datetime.getFullYear()} <br></br>
                at {datetime.getHours()}:{datetime.getMinutes()}:{datetime.getSeconds()}
            </>
        );
        return date;
    };

    const renderSelectedNft = (nft: Nft) => {
        return (
            <div className={styles.inlineFlexCenter}>
                Selected:
                <div
                    className={styles.box}
                    style={{
                        flexWrap: "nowrap",
                        minWidth: "150px",
                        marginTop: "0",
                        marginLeft: "20px",
                    }}
                >
                    <span className={styles.text} style={{ display: "inline-flex" }}>
                        {nft.name} Boost: {getBoostAttributes(nft)}
                        <CloseOutlined className={styles.removeIcon} onClick={() => setSelectedNFT(undefined)} />
                    </span>
                </div>
            </div>
        );
    };

    const noCurrentSelection = (boostStatus && boostStatus.isBoost) || !selectedNFT;

    return (
        <Spin spinning={loading} style={{ marginTop: "8px" }}>
            <div className={styles.box}>
                <div className={styles.columnFlexStart}>
                    {noCurrentSelection ? (
                        <>
                            <div style={{ display: "inline-flex" }}>
                                <span style={{ marginRight: "6px" }}>Actual:</span>
                                <span className={styles.text}>
                                    {boostStatus && boostStatus.isBoost
                                        ? " NFT Boost " + boostStatus.boostValue + "%"
                                        : "No boost yet"}
                                </span>
                            </div>
                            {boostStatus && boostStatus.isBoost && (
                                <div>
                                    Added on: <span className={styles.text}>{getDate(boostStatus.sinceTimeStamp)}</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <Button
                            type="primary"
                            className="button-colored-green-action"
                            onClick={() => applyNFTboost(selectedNFT)}
                        >
                            APPLY BOOST
                        </Button>
                    )}
                </div>

                {!isMobile && <Divider type="vertical" style={{ borderLeft: "2px solid #75e287", height: "25px" }} />}

                <div style={{ maxWidth: "55%" }}>
                    {boostStatus?.isBoost && deposited.stakes.stakes.length > 0 ? (
                        <Alert
                            type="info"
                            showIcon
                            message={
                                "To prevent any loss, please withdraw your stakes and rewards before switching to a new NFT boost."
                            }
                        />
                    ) : boostStatus?.isBoost && deposited.stakes.stakes.length === 0 ? (
                        <ButtonAction title="DESACTIVATE NFT BOOST" action={() => removeNftBoost(setSelectedNFT)} />
                    ) : (
                        <>
                            {!selectedNFT ? (
                                <ButtonAction title="SELECT NFT BOOSTER" action={() => setVisibility(true)} />
                            ) : (
                                renderSelectedNft(selectedNFT)
                            )}
                        </>
                    )}
                </div>
                <Modal
                    open={visible}
                    footer={null}
                    onCancel={() => setVisibility(false)}
                    wrapClassName="modalStyle"
                    bodyStyle={{
                        width: "auto",
                        minWidth: "300px",
                    }}
                >
                    <div className="modal_title">Select an NFT booster:</div>
                    <DisplayNft selectable={true} handleSelectNft={handleSelectNft} />
                </Modal>
            </div>
        </Spin>
    );
};

export default NftBoostSelection;
