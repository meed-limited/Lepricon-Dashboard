import { useEffect, useState } from "react";

import { Skeleton } from "antd";

import { getEllipsisTxt } from "../../../utils/format";
import Jazzicons from "./Jazzicons";

const styles = {
    address: {
        display: "flex",
        height: "42px",
        paddingLeft: "15px",
        gap: "15px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "9px",
        alignItems: "center",
        fontSize: "17px",
    },
};

const Address: React.FC<AddressProps> = (props) => {
    const [address, setAddress] = useState<string>();
    const [isClicked, setIsClicked] = useState<boolean>(false);

    useEffect(() => {
        if (props.account !== undefined) setAddress(props.account);
    }, [props.account]);

    useEffect(() => {
        if (isClicked === true)
            setTimeout(() => {
                setIsClicked(false);
            }, 10000);
    }, [isClicked]);

    if (address === undefined) return <Skeleton paragraph={{ rows: 1, width: "100%" }} title={false} active />;

    const Copy = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#1780FF"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ cursor: "pointer" }}
            onClick={() => {
                navigator.clipboard.writeText(address);
                setIsClicked(true);
            }}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 3v4a1 1 0 0 0 1 1h4" />
            <path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z" />
            <path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
            <title id="copy-address">Copy Address</title>
        </svg>
    );

    return (
        <div style={styles.address}>
            {props.avatar === "left" && <Jazzicons seed={address} />}
            <p>{props.size ? getEllipsisTxt(address, props.size) : address}</p>
            {props.avatar === "right" && <Jazzicons seed={address} />}
            {props.copyable && (isClicked ? <Check /> : <Copy />)}
        </div>
    );
};

export default Address;

const Check = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="3"
        stroke="#21BF96"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 12l5 5l10 -10" />
        <title id="copied-address">Copied!</title>
    </svg>
);
