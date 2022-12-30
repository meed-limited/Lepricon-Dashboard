import { Dispatch, FC, SetStateAction, useState } from "react";
import Moralis from "moralis";
import { Alert, Button, Divider, Modal } from "antd";
import { useUserData } from "../../../../context/UserContextProvider";
import styles from "../../../../styles/Staking.module.css";
import { useReadContract } from "../../../../hooks";
import { DisplayNft } from "../../../elements";
import { getBoostAttributes } from "../../../../utils/getNftAttributes";
import { ButtonAction } from "../../../elements/Buttons";

// import { setBoost } from "helpers/backend_call";
// import { resetBoost } from "helpers/contractCall/writeCall";
// import { getDate } from "helpers/formatters";

type NftBoostSelectionProps = {
    deposited: StakesPerPool;
};

const NftBoostSelection: FC<NftBoostSelectionProps> = ({ deposited }) => {
    const { address, userNFTs, boostStatus, syncWeb3 } = useUserData();
    const { getBoost } = useReadContract();
    const [selectedNFT, setSelectedNFT] = useState<Nft>();
    const [visible, setVisibility] = useState(false);

    const openNftModal = () => {
        setVisibility(true);
    };

    const changeColorOnHover = (e: any) => {
        e.target.style.color = "#75e287";
    };

    const changeColorOnLeave = (e: any) => {
        e.target.style.color = "black";
    };

    const removeSelectedNft = () => {
        setSelectedNFT(undefined);
    };

    // const applyNFTboost = async () => {
    //     if (address && selectedNFT) {
    //         await setBoost(address, selectedNFT);
    //     }
    // };

    // const resetIsStakedOnDB = async (tokenId: any) => {
    //     const NFTboostOwners = Moralis.Object.extend("NFTboostOwners");
    //     const query = new Moralis.Query(NFTboostOwners);
    //     query.equalTo("token_id", tokenId);
    //     const NFT = await query.first();

    //     // Edit NFT owner in Moralis DB
    //     NFT.set("isStaked", false);
    //     await NFT.save();
    // };

    // const resetBoostStatus = async () => {
    //     const tokenIdToReset = boostStatus?.tokenId;
    //     await resetBoost(address)
    //         .then(() => {
    //             resetIsStakedOnDB(tokenIdToReset);
    //             setSelectedNFT(undefined);
    //             syncWeb3();
    //         })
    //         .catch((err: any) => {
    //             console.log(err);
    //         });
    // };

    const handleCancel = () => {
        setVisibility(false);
    };

    const condition = (boostStatus && boostStatus.isBoost) || !selectedNFT;

    return (
        <>
            <div className={styles.box}>
                <div className={styles.columnFlexStart}>
                    {condition ? (
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
                                    Added on:
                                    {/* <span className={styles.text}>{getDate(boostStatus.sinceTimeStamp)}</span> */}
                                </div>
                            )}
                        </>
                    ) : (
                        <Button
                            type="primary"
                            className="button-colored-green-action"
                            onClick={() => console.log("boost added")}
                        >
                            APPLY BOOST
                        </Button>
                    )}
                </div>
                <Divider type="vertical" style={{ borderLeft: "1px solid #75e287" }} />

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
                    <ButtonAction title="DESACTIVATE NFT BOOST" action={() => console.log("boost removed")} />
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
                                        minWidth: "350px",
                                        width: "100%",
                                        marginTop: "0",
                                        marginLeft: "20px",
                                    }}
                                >
                                    <span className={styles.text} style={{ display: "inline-flex" }}>
                                        {selectedNFT.name} Boost: {getBoostAttributes(selectedNFT)}%{" "}
                                        <div
                                            className={styles.removeIcon}
                                            onClick={removeSelectedNft}
                                            onMouseOver={changeColorOnHover}
                                            onMouseOut={changeColorOnLeave}
                                        >
                                            {/* <Icon fill="red" size={26} svg="xCircle" /> */}
                                        </div>
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
                <DisplayNft />
            </Modal>
        </>
    );
};

export default NftBoostSelection;
