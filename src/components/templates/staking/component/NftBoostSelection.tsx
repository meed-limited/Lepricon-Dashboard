import { FC, useState } from "react";
import { Alert, Button, Divider, Modal } from "antd";
import { useUserData } from "../../../../context/UserContextProvider";
import styles from "../../../../styles/Staking.module.css";
import { useWindowWidthAndHeight, useWriteContract } from "../../../../hooks";
import { DisplayNft } from "../../../elements";
import { getBoostAttributes } from "../../../../utils/getNftAttributes";
import { ButtonAction } from "../../../elements/Buttons";
// import { updateNftStatus } from "../../../../utils/db";
import { useBoostAPI } from "../../../../hooks/useBoostAPI";
import { CloseOutlined } from "@ant-design/icons";

type NftBoostSelectionProps = {
    deposited: StakesPerPool;
};

const NftBoostSelection: FC<NftBoostSelectionProps> = ({ deposited }) => {
    const { address, boostStatus, syncWeb3 } = useUserData();
    const { resetBoost } = useWriteContract();
    const { setBoost, resetBoostInDb } = useBoostAPI();
    const { isMobile } = useWindowWidthAndHeight();
    const [selectedNFT, setSelectedNFT] = useState<Nft>();
    const [visible, setVisibility] = useState(false);

    const openNftModal = () => {
        setVisibility(true);
    };

    const handleSelectNft = (nft: Nft) => {
        setSelectedNFT(nft);
        setVisibility(false);
    };

    const removeSelectedNft = () => {
        setSelectedNFT(undefined);
    };

    const getDate = (timestamp: number) => {
        let datetime = new Date(timestamp * 1000);
        let date = (
            <>
                {datetime.getDate()}/{datetime.getMonth() + 1}/{datetime.getFullYear()} <br></br>
                at {datetime.getHours()}:{datetime.getMinutes()}:{datetime.getSeconds()}
            </>
        );
        return date;
    };

    const applyNFTboost = async () => {
        if (address && selectedNFT) {
            const boost = parseInt(getBoostAttributes(selectedNFT).toString());
            await setBoost(address, selectedNFT.token_address, Number(selectedNFT.token_id), boost).then(() => {
                syncWeb3();
            });
        }
    };

    const resetBoostStatus = async () => {
        if (boostStatus) {
            const id = boostStatus?.tokenId;
            const nftAddress = boostStatus?.NftContractAddress;
            await resetBoost()
                .then(() => {
                    resetBoostInDb(address as string, nftAddress, id, false);
                    setSelectedNFT(undefined);
                    syncWeb3();
                })
                .catch((err: any) => {
                    console.log(err);
                });
        }
    };

    const handleCancel = () => {
        setVisibility(false);
    };

    const noCurrentSelection = (boostStatus && boostStatus.isBoost) || !selectedNFT;

    return (
        <>
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
                        <Button type="primary" className="button-colored-green-action" onClick={() => applyNFTboost()}>
                            APPLY BOOST
                        </Button>
                    )}
                </div>
                {!isMobile && <Divider type="vertical" style={{ borderLeft: "2px solid #75e287", height: "25px" }} />}

                {boostStatus?.isBoost && deposited.stakes.stakes.length > 0 && (
                    <Alert
                        type="info"
                        style={{ maxWidth: "55%" }}
                        showIcon
                        message={
                            "To prevent any loss, please withdraw your stakes and rewards before switching to a new NFT boost."
                        }
                    />
                )}

                {boostStatus?.isBoost && deposited.stakes.stakes.length === 0 && (
                    <div style={{ maxWidth: "55%" }}>
                        <ButtonAction title="DESACTIVATE NFT BOOST" action={() => resetBoostStatus()} />
                    </div>
                )}
                {!boostStatus?.isBoost && (
                    <div>
                        {!selectedNFT && <ButtonAction title="SELECT NFT BOOSTER" action={() => openNftModal()} />}
                        {selectedNFT && (
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
                                        {selectedNFT.name} Boost: {getBoostAttributes(selectedNFT)}
                                        <CloseOutlined className={styles.removeIcon} onClick={removeSelectedNft} />
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <Modal
                open={visible}
                footer={null}
                onCancel={handleCancel}
                wrapClassName="modalStyle"
                bodyStyle={{
                    width: "auto",
                    minWidth: "300px",
                }}
            >
                <div className="modal_title">Select an NFT booster:</div>
                <DisplayNft selectable={true} handleSelectNft={handleSelectNft} />
            </Modal>
        </>
    );
};

export default NftBoostSelection;
