import { Modal, Table, Tag } from "antd";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useUserData } from "../../../../context/UserContextProvider";

type DetailsModalProps = {
    lock: number;
    deposited: StakesPerPool;
    open: boolean;
    setVisibility: Dispatch<SetStateAction<boolean>>;
};

const DetailsModal: FC<DetailsModalProps> = ({ lock, deposited, open, setVisibility }) => {
    const { tokenName } = useUserData();
    const timestamp = Math.floor(Date.now() / 1000);

    const formatDate = (timestamp: number) => {
        const intialDate = new Date(timestamp * 1000);
        const formattedDate = (
            <>
                {intialDate.getDate()}/{intialDate.getMonth() + 1}/{intialDate.getFullYear()} <br></br>
                at {intialDate.getHours()}:{intialDate.getMinutes()}:{intialDate.getSeconds()}
            </>
        );
        return formattedDate;
    };

    const daysFrom = (stake: ParsedStakeStruct) => {
        return Math.floor((timestamp - Number(stake.since)) / (24 * 3600));
    };

    const getDateSince = (since: string) => {
        var date = Number(timestamp) - parseInt(since);
        date = Math.floor(date / (24 * 3600));
        return date;
    };

    const title = (lock: number) => {
        if (lock === 0) {
            return "No-Lock";
        } else return `${lock} months lock`;
    };

    const daysLeft = (stake: ParsedStakeStruct) => {
        let left = stake.dayLock - getDateSince(stake.since);
        if (left > 0) {
            let text = `In ${left} days`;
            return <Tag color="red">{text}</Tag>;
        } else {
            return <Tag color="green">Unlocked</Tag>;
        }
    };

    const handleCancel = () => {
        setVisibility(false);
    };

    const data =
        deposited.stakes.stakes.length === 0
            ? undefined
            : deposited.stakes.stakes.map((stake, id) => {
                  return {
                      id: `${stake.index}`,
                      date: formatDate(Number(stake.since)),
                      amount: `${stake.amount} ${tokenName}`,
                      days: daysFrom(stake),
                      unlock: daysLeft(stake),
                      rewards: `${stake.cumulatedReward.toFixed(3)} ${tokenName}`,
                      key: id,
                  };
              });

    const columns = [
        {
            title: "Staked Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Staked On",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
        },
        {
            title: "Daily",
            dataIndex: "days",
            key: "days",
        },
        {
            title: "Unlocked In",
            dataIndex: "unlock",
            key: "unlock",
        },
        {
            title: "Rewards",
            dataIndex: "rewards",
            key: "rewards",
        },
    ];

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Modal open={open} footer={null} wrapClassName="modalStyle" onCancel={handleCancel} width="600px">
                <div className="modal_title">{`Stakes details for the ${title(lock)} pool:`}</div>
                <Table pagination={false} dataSource={data} columns={columns} />
            </Modal>
        </div>
    );
};

export default DetailsModal;
