import Modal from "antd/lib/modal/Modal";
import Image from "next/image";

import NftTextDetails from "./NftTextDetails";
import styles from "../../../../styles/Wallet.module.css";
import {
    getBoostAttributes,
    getTierAttributes,
    getSeriesAttributes,
    getEditionAttributes,
} from "../../../../utils/getNftAttributes";

const NftsDetailsModal: React.FC<NftDetailsProps> = ({ nft, isModalOpen, setIsModalOpen }) => {
    return (
        <>
            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={false}
                wrapClassName="modalStyle"
                bodyStyle={{
                    minWidth: "250px",
                    textAlign: "center",
                    margin: "auto",
                    paddingBlock: "15px",
                    fontSize: "17px",
                    fontWeight: "500",
                }}
                width="400px"
            >
                <div className={styles.nftModalDetails}>
                    <Image
                        src={`${nft.image}`}
                        alt="nft_image"
                        width={200}
                        height={250}
                        style={{
                            margin: "auto",
                            borderRadius: "10px",
                        }}
                    />

                    <div className={styles.nftModalDetailsText}>
                        <h3 style={{ color: "black" }}>
                            {nft?.name} #{nft?.token_id}
                        </h3>
                        <h4>{nft?.metadata.description}</h4>
                        <br></br>

                        <div className={styles.nftModalDetailsSubtext}>
                            <NftTextDetails title={"Boost"} value={getBoostAttributes(nft)} isCopyable={false} />
                            <NftTextDetails title={"Tier"} value={getTierAttributes(nft)} isCopyable={false} />
                            <NftTextDetails title={"Series"} value={getSeriesAttributes(nft)} isCopyable={false} />
                            <NftTextDetails title={"Edition"} value={getEditionAttributes(nft)} isCopyable={false} />
                        </div>
                    </div>
                </div>
                <div style={{ marginBlock: "20px", paddingInline: "10px" }}>
                    <NftTextDetails title={"Contract Address"} value={nft?.token_address} isCopyable={true} />
                    <NftTextDetails title={"Contract Type"} value={nft?.contract_type} isCopyable={true} />
                </div>
            </Modal>
        </>
    );
};

export default NftsDetailsModal;
