import AmountButton from "./AmountButton";
import { Button, Divider, Input, Modal, Select, Spin } from "antd";
import { useUserData } from "../../../../context/UserContextProvider";

const styles = {
    container: {
        backgroundColor: "white",
        display: "flex",
        width: "60%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "10px",
        border: "none",
        color: "black",
        textAlign: "center",
        transition: "opacity 0.3s ease-out",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        gap: "15px",
        margin: "auto",
        marginBottom: "20px",
        paddingTop: "20px",
        fontSize: "17px",
    },
    content1: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "60%",
        paddingBottom: "10px",
    },
    content2: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        columnGap: "20px",
        width: "70%",
    },
    amountButton: {
        display: "flex",
        alignContent: "center",
        height: "100%",
    },
};

const WithdrawSingleModal = ({
    open,
    waitingInModal,
    setVisibility,
    amountToWithdraw,
    onChangeWithdrawAmount,
    onMaxSingle,
    selectStakeToWithdraw,
    data,
    stakeToWithdrawFrom,
    onAction2,
}) => {
    const { balances } = useUserData();

    const handleCancel = () => {
        setVisibility(false);
    };

    console.log(data);

    return (
        <>
            <Modal
                title={`Select the stake and the amount to withdraw:`}
                open={open}
                footer={null}
                onCancel={handleCancel}
                bodyStyle={{
                    width: "700px",
                }}
            >
                <Spin spinning={waitingInModal} size="large">
                    <div style={styles.container}>
                        <label>1. Select the stake to withdraw from:</label>
                        <div style={styles.content1}>
                            {/* <Select placeholder="Select stake Id" onChange={(e) => selectStakeToWithdraw(e)} options={data} /> */}
                            <Select placeholder="Select stake Id" onChange={(e) => selectStakeToWithdraw(e)} />
                        </div>
                        <label>2. Amount to withdraw from selected stake:</label>
                        <div style={styles.content2}>
                            <div style={{ width: "60%" }}>
                                <Input
                                    label={amountToWithdraw ? "" : "Enter amount"}
                                    id="input-action"
                                    onChange={(e) => onChangeWithdrawAmount(e.target.value)}
                                    type="number"
                                    validation={{
                                        numberMax: `${stakeToWithdrawFrom !== {} ? stakeToWithdrawFrom.amount : 0}`,
                                        numberMin: 0,
                                    }}
                                    value={amountToWithdraw}
                                />
                            </div>

                            <div style={styles.amountButton}>
                                <AmountButton buttonText={"max"} buttonFunction={onMaxSingle} />
                            </div>
                        </div>
                        <Divider />
                        <div
                            style={{
                                width: "50%",
                                margin: "auto",
                                paddingBottom: "40px",
                            }}
                        >
                            <Button
                                type="primary"
                                id="button-colored-green-action"
                                onClick={() => onAction2(stakeToWithdrawFrom?.stakeId, amountToWithdraw)}
                            >
                                WITHDRAW
                            </Button>
                        </div>
                    </div>
                </Spin>
            </Modal>
        </>
    );
};

export default WithdrawSingleModal;
