import { FC, useState } from "react";

import { Button, Divider, InputNumber, Select } from "antd";

import { MAX_INT } from "../../../data/constant";
import { useWriteContract } from "../../../hooks";
import styles from "../../../styles/Admin.module.css";
import { AddressInput } from "../AddressInput";

const AdminPane: FC<AdminPaneProps> = ({ setAdminPane }) => {
    const { approveToken, setAPR, setNewAdmin, setNewToken, setNewOwner } = useWriteContract();
    const [newApr, setNewApr] = useState<number>(0);
    const [timelock, setTimelock] = useState<number>(0);
    const [newAdminAdd, setNewAdminAdd] = useState<string>("");
    const [newOwnerAdd, setNewOwnerAdd] = useState<string>("");
    const [newTokenAdd, setNewTokenAdd] = useState<string>("");

    const handleBackClic = () => {
        setAdminPane(false);
    };

    const onChange = (value: number | null) => {
        if (value !== null) setNewApr(value);
        else setNewApr(0);
    };

    const options = [
        {
            value: 0,
            label: "No-Lock",
        },
        {
            value: 3,
            label: "3-months",
        },
        {
            value: 6,
            label: "6-months",
        },
        {
            value: 12,
            label: "12-months",
        },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.title}>Admin Panel</div>
            <Divider />

            <p className={styles.text}>Edit staking yields APR</p>
            <div style={{ width: "60%", margin: "auto" }}>
                <div className={styles.setApr}>
                    <div className={styles.aprSettings}>
                        <InputNumber
                            style={{ width: 150 }}
                            placeholder={`Enter the new APR`}
                            value={newApr}
                            onChange={onChange}
                        />
                        <Select
                            placeholder="Select a pool"
                            style={{ width: 150 }}
                            onChange={(value: number) => setTimelock(value)}
                            options={options}
                        />
                    </div>
                </div>
                <Button type="primary" onClick={() => setAPR(newApr, timelock)}>
                    Set APR
                </Button>

                <Divider />

                <p className={styles.text}>Edit the staking contract&apos;s addresses: Admin / Token / Owner</p>
                <AddressInput
                    style={{ marginBottom: "5px" }}
                    placeholder="Enter the new admin address (the back-end server)"
                    onChange={setNewAdminAdd}
                />
                <Button
                    type="primary"
                    onClick={() => setNewAdmin(newAdminAdd)}
                    style={{ marginRight: "10px", marginBottom: "20px" }}
                >
                    Set admin address
                </Button>
                <Button
                    type="primary"
                    onClick={() => approveToken(MAX_INT)}
                    style={{ marginLeft: "10px", marginBottom: "20px" }}
                >
                    Set infinite allowance
                </Button>
                <AddressInput
                    style={{ marginBottom: "5px" }}
                    placeholder="Enter the new token address (token used for staking)"
                    onChange={setNewTokenAdd}
                />
                <Button type="primary" onClick={() => setNewToken(newTokenAdd)} style={{ marginBottom: "20px" }}>
                    Set token address
                </Button>
                <AddressInput
                    style={{ marginBottom: "5px" }}
                    placeholder="Enter the new owner address (smart-contract owner)"
                    onChange={setNewOwnerAdd}
                />
                <Button type="primary" onClick={() => setNewOwner(newOwnerAdd)} style={{ marginBottom: "20px" }}>
                    Set owner address
                </Button>
            </div>

            <div>
                <Button className={styles.backButton} shape="round" onClick={handleBackClic}>
                    Back
                </Button>
            </div>
        </div>
    );
};

export default AdminPane;
