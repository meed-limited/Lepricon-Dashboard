import { Modal, Table, Tag } from "antd";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useUserData } from "../../../../context/UserContextProvider";

type DetailsModalProps = {
    lock: number;
    deposited: any;
    open: boolean;
    setVisibility: Dispatch<SetStateAction<boolean>>;
};

const DetailsModal: FC<DetailsModalProps> = ({ lock, deposited, open, setVisibility }) => {
    const { tokenName } = useUserData();

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

    const getAllDateFromBlock = (deposited: { stakes: { stakes: any[] } }) => {
        deposited.stakes.stakes.map((stake: { since: any; numberOfDays: number }) => {
            getDateFromBlock(stake.since).then((res) => {
                stake.numberOfDays = res;
            });
        });
    };

    useEffect(() => {
        getAllDateFromBlock(deposited);
        return;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deposited]);

    const getDateFromBlock = async (since: string) => {
        const timestamp = Math.floor(Date.now() / 1000);
        var date = Number(timestamp) - parseInt(since);
        date = Math.floor(date / (24 * 3600));
        return date;
    };

    const title = (lock: number) => {
        if (lock === 0) {
            return "No-Lock";
        } else return `${lock} months lock`;
    };

    const daysLeft = (stake: Stake) => {
        let left = stake.dayLock - stake?.numberOfDays;
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
            ? []
            : deposited.stakes.stakes.map(
                  (stake: { since: any; amount: any; numberOfDays: any; cumulatedReward: number }, id: any) => [
                      "",
                      id,
                      formatDate(stake.since),
                      `${stake.amount} ${tokenName}`,
                      stake.numberOfDays,
                      daysLeft(stake),
                      `${stake.cumulatedReward.toFixed(3)} ${tokenName}`,
                  ]
              );

    const columns = [
        {
            title: "Staked Id",
            dataIndex: "date",
            key: "date",
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
            <Modal
                title={`Stakes details for the ${title(lock)} pool:`}
                open={open}
                footer={null}
                onCancel={handleCancel}
            >
                <Table pagination={false} dataSource={data} columns={columns} />
            </Modal>
        </div>
    );
};

export default DetailsModal;
