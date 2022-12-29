import React, { useState } from "react";
// import AddressInput from "../../../AddressInput";
import { Modal, Spin, Input } from "antd";
import { useWriteContract } from "../../../../hooks";

const TransferNftModal: React.FC<any> = ({ nftToTransfer, setVisibility, visible }) => {
    const { transferNft } = useWriteContract();
    const [receiverToSend, setReceiver] = useState<any>(null);
    const [isPending, setIsPending] = useState(false);

    const transfer = async (nft: Nft, receiver: string) => {
        setIsPending(true);
        const success = await transferNft(nft, receiver);
        if (success) {
            setIsPending(false);
            setVisibility(false);
        } else setIsPending(false);
    };

    const handleCancel = () => {
        setVisibility(false);
    };

    return (
        <Modal
            title={`Transfer <${nftToTransfer?.name || "NFT"} > ?`}
            open={visible}
            onCancel={handleCancel}
            onOk={() => transfer(nftToTransfer, receiverToSend)}
            confirmLoading={isPending}
            okText="Send"
            bodyStyle={{ width: "95%", margin: "auto" }}
        >
            <Spin spinning={isPending} size="large">
                {/* <AddressInput
                    autoFocus
                    placeholder="Receiver"
                    onChange={setReceiver}
                    style={{ marginBottom: "15px" }}
                /> */}
                <Input autoFocus placeholder="Receiver" onChange={setReceiver} style={{ marginBottom: "15px" }} />
            </Spin>
        </Modal>
    );
};

export default TransferNftModal;
