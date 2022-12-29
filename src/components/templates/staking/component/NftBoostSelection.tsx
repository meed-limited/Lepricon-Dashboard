import { Dispatch, FC, SetStateAction, useState } from "react";
import Moralis from "moralis";
import DisplayNFT from "components/DisplayNFT";
import { resetBoost } from "helpers/contractCall/writeCall";
import { getBoostAttributes } from "helpers/getNftAttributes";
import { Alert, Button, Divider, Modal } from "antd";
import { setBoost } from "helpers/backend_call";
import { getDate } from "helpers/formatters";
import { useUserData } from "../../../../context/UserContextProvider";
import styles from "../../../../styles/Staking.module.css";
import { useReadContract } from "../../../../hooks";

type NftBoostSelectionProps = {
    deposited: any;
    selectedNFT: any;
    setSelectedNFT: Dispatch<SetStateAction<any[]>>;
};

const NftBoostSelection: FC<NftBoostSelectionProps> = ({ deposited, selectedNFT, setSelectedNFT }) => {
    const { address, stakingAddress, userNFTs, boostStatus, setBoostStatus } = useUserData();
    const { getBoost } = useReadContract();
    const [visible, setVisibility] = useState(false);

    const openNftModal = () => {
        setVisibility(true);
    };

    const getBoostStatus = async () => {
        const boost = await getBoost();
        if (boost) {
            const temp = {
                isBoost: boost.isBoost,
                NftContractAddress: boost.NftContractAddress,
                tokenId: boost.tokenId.toString(),
                boostValue: boost.boostValue.toString(),
                sinceTimeStamp: Number(boost.since),
                sinceDate: new Date(Number(boost.since) * 1000),
            };
            setBoostStatus(boost);
        }
    };

    const changeColorOnHover = (e: any) => {
        e.target.style.color = "#75e287";
    };

    const changeColorOnLeave = (e: any) => {
        e.target.style.color = "black";
    };

    const removeSelectedNft = () => {
        setSelectedNFT([]);
    };

    const applyNFTboost = async () => {
        if (address && selectedNFT) {
            await setBoost(address, selectedNFT);
        }
    };

    const resetIsStakedOnDB = async (tokenId: any) => {
        const NFTboostOwners = Moralis.Object.extend("NFTboostOwners");
        const query = new Moralis.Query(NFTboostOwners);
        query.equalTo("token_id", tokenId);
        const NFT = await query.first();

        // Edit NFT owner in Moralis DB
        NFT.set("isStaked", false);
        await NFT.save();
    };

    const resetBoostStatus = async () => {
        const tokenIdToReset = boostStatus.tokenId;
        await resetBoost(address, stakingAddress)
            .then(() => {
                resetIsStakedOnDB(tokenIdToReset);
                setSelectedNFT([]);
                getBoost();
            })
            .catch((err: any) => {
                console.log(err);
            });
    };

    const handleCancel = () => {
        setVisibility(false);
    };

    const condition = (boostStatus && boostStatus.isBoost) || selectedNFT.length === 0;

    return (
        <>
            <div className={styles.box}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                    }}
                >
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
                                    Added on: <span className={styles.text}>{getDate(boostStatus.sinceTimeStamp)}</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <Button type="primary" id="button-colored-green-action" onClick={applyNFTboost}>
                            APPLY BOOST
                        </Button>
                    )}
                </div>
                <Divider type="vertical" style={{ borderLeft: "1px solid #75e287" }} />

                {boostStatus?.isBoost && deposited?.stakes.stakes.length > 0 && (
                    <Alert
                        type="info"
                        style={{ maxWidth: "55%" }}
                        showIcon
                        message={
                            "To prevent any loss, please withdraw your stakes and rewards before switching to a new NFT boost."
                        }
                    />
                )}

                {boostStatus?.isBoost && deposited?.stakes.stakes.length === 0 && (
                    <Button type="primary" id="button-colored-red-action" onClick={resetBoostStatus}>
                        DESACTIVATE NFT BOOST
                    </Button>
                )}
                {!boostStatus?.isBoost && (
                    <div>
                        {!selectedNFT ||
                            (selectedNFT.length === 0 && (
                                <Button type="primary" id="button-colored-green-action" onClick={openNftModal}>
                                    SELECT NFT BOOSTER
                                </Button>
                            ))}
                        {selectedNFT.length !== 0 && (
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
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
                                        {selectedNFT?.name} Boost: {getBoostAttributes(selectedNFT)}%{" "}
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
                bodyStyle={{
                    width: "auto",
                    minWidth: "600px",
                }}
            >
                <div className="modal_title">Select an NFT to boost your staking yield:</div>
                <DisplayNFT
                    userNFTs={userNFTs}
                    action={setSelectedNFT}
                    chainId={undefined}
                    isSelection={true}
                    setSelectedNFT={setSelectedNFT}
                    setVisibility={setVisibility}
                />
            </Modal>
        </>
    );
};

export default NftBoostSelection;
