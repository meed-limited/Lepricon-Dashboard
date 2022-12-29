import React, { FC, useState } from "react";

import { FileSearchOutlined, SendOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Card, Image, Tooltip, Skeleton, Alert } from "antd";

import { useUserData } from "../../../context/UserContextProvider";
import { useIPFS, useVerifyMetadata, useWindowWidthAndHeight } from "../../../hooks";

import { getExplorer } from "../../../utils/getExplorerByChain";
import { isProdEnv } from "../../../data/constant";
import styles from "../../../styles/Wallet.module.css";
import { getNftImage } from "../../../utils/getNftAttributes";
import Link from "next/link";
import NftsDetailsModal from "../../templates/wallet/component/NftDetailsModal";
import TransferNftModal from "../../templates/wallet/component/TransferNftModal";
const { Meta } = Card;

const DisplayNft: FC = () => {
    const { isConnected, userNFTs } = useUserData();
    const { isMobile } = useWindowWidthAndHeight();
    const { verifyMetadata } = useVerifyMetadata();

    const [nftToShow, setNftToShow] = useState<Nft>();
    const [isNftDetailsModalOpen, setIsNftDetailsModalOpen] = useState<boolean>(false);

    const [nftToTransfer, setNftToTransfer] = useState<Nft>();
    const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
    const { resolveLink } = useIPFS();

    const handleTransfer = (nft: NFTinDB) => {
        setNftToTransfer(nft);
        setIsTransferModalOpen(true);
    };

    const handleShowDetail = (nft: Nft) => {
        setNftToShow(nft);
        setIsNftDetailsModalOpen(true);
    };

    const alertMessage = <Alert type="info" showIcon message={"No NFTs found on this account"} />;

    return (
        <div className={styles.nftContainer}>
            <Skeleton loading={isConnected && !userNFTs}>
                {userNFTs?.total === 0 && alertMessage}

                {userNFTs.result &&
                    userNFTs.result.length > 0 &&
                    userNFTs.result.map((nft: any, index: number) => {
                        nft = verifyMetadata(nft);
                        console.log(nft);

                        if (!nft.image) {
                            const data = JSON.parse(nft.metadata);
                            nft.metadata = data;
                            if (nft.metadata) {
                                nft.image = resolveLink(nft.metadata.image);
                                nft.name = nft.metadata.name;
                            }
                            if (isProdEnv) {
                                nft.image = getNftImage(nft);
                            }
                        }

                        const description = <span onClick={() => handleShowDetail(nft)}>Click for more details</span>;

                        return (
                            <Card
                                hoverable
                                actions={[
                                    <Tooltip title="View On Blockexplorer" key={index}>
                                        <Link
                                            href={`${getExplorer()}token/${nft.token_address}?a=${nft.token_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FileSearchOutlined className={styles.nftActionIcon} />
                                        </Link>
                                    </Tooltip>,

                                    <Tooltip title="Sell On Marketplace" key={index}>
                                        <Link
                                            href={isProdEnv ? "https://opensea.io/" : "https://testnets.opensea.io/"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ShoppingCartOutlined className={styles.nftActionIcon} />
                                        </Link>
                                    </Tooltip>,

                                    <Tooltip title="Transfer NFT" key={index}>
                                        <SendOutlined className={styles.nftActionIcon} onClick={handleTransfer} />
                                    </Tooltip>,
                                ]}
                                style={{
                                    width: isMobile ? 160 : 210,
                                    height: isMobile ? 275 : 360,
                                    border: "2px solid #e7eaf3",
                                }}
                                cover={
                                    <Image
                                        preview={false}
                                        src={nft?.image || "error"}
                                        fallback="data:image/png;base64,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"
                                        alt=""
                                        style={{
                                            width: "100% !important",
                                            height: isMobile ? "129px" : "220px",
                                            borderRadius: "10px",
                                        }}
                                        onClick={() => handleShowDetail(nft)}
                                    />
                                }
                                key={index}
                            >
                                <Meta
                                    className={styles.nftAttibutes}
                                    title={`${nft.name} #${nft?.token_id}`}
                                    description={description}
                                />
                            </Card>
                        );
                    })}
            </Skeleton>
            {nftToShow && (
                <NftsDetailsModal
                    nft={nftToShow}
                    isModalOpen={isNftDetailsModalOpen}
                    setIsModalOpen={setIsNftDetailsModalOpen}
                />
            )}
            {nftToTransfer && (
                <TransferNftModal
                    nft={nftToTransfer}
                    isModalOpen={isTransferModalOpen}
                    setIsModalOpen={setIsTransferModalOpen}
                />
            )}
        </div>
    );
};

export default DisplayNft;
