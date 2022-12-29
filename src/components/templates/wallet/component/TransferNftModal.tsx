import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, Spin } from "antd";
import { useWriteContract } from "../../../../hooks";
import { AddressInput } from "../../../elements/AddressInput";

type TransferNftModalProps = {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    nft: Nft;
};

const TransferNftModal: React.FC<TransferNftModalProps> = ({ isModalOpen, setIsModalOpen, nft }) => {
    const { transferNft } = useWriteContract();

    const [receiverToSend, setReceiver] = useState<any>(null);
    const [isPending, setIsPending] = useState(false);

    const transfer = async (nft: Nft, receiver: string) => {
        setIsPending(true);
        const success = await transferNft(nft, receiver);
        if (success) {
            setIsPending(false);
            setIsModalOpen(false);
        } else setIsPending(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={() => transfer(nft, receiverToSend)}
            wrapClassName="modalStyle"
            confirmLoading={isPending}
            okText="Send"
            bodyStyle={{ width: "95%", margin: "auto" }}
        >
            <span className="modal_title">{`Transfer:  ${nft.name} - #${nft.token_id} ?`}</span>
            <Spin spinning={isPending} size="large">
                <AddressInput
                    autoFocus
                    placeholder="Receiver"
                    onChange={setReceiver}
                    style={{ marginBottom: "15px" }}
                />
            </Spin>
        </Modal>
    );
};

export default TransferNftModal;
