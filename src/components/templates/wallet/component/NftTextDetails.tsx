import { useEffect, useState } from "react";

import { CopyOutlined } from "@ant-design/icons";
import { Progress, Tooltip } from "antd";

import styles from "../../../../styles/Wallet.module.css";
import { getEllipsisTxt } from "../../../../utils/format";

const NftTextDetails: React.FC<TraitProps> = ({ title, value, isCopyable }) => {
    const [isClicked, setIsClicked] = useState<boolean>(false);

    const handleCopyClick = (value: string) => {
        navigator.clipboard.writeText(value);
        setIsClicked(true);
    };

    useEffect(() => {
        if (isClicked === true)
            setTimeout(() => {
                setIsClicked(false);
            }, 10000);
    }, [isClicked]);

    const Copy = () => (
        <Tooltip title="Copy Address">
            <CopyOutlined
                style={{ cursor: "pointer", paddingLeft: "10px" }}
                onClick={() => {
                    if (typeof value === "string") handleCopyClick(value);
                }}
            />
        </Tooltip>
    );

    const Check = () => (
        <Tooltip title="Copied!">
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
        </Tooltip>
    );

    return (
        <div className={styles.traitTextDetails}>
            <div>{title}:</div>
            <div>
                <>
                    {typeof value === "number" ? (
                        <Progress steps={10} showInfo={false} percent={value * 10} />
                    ) : (
                        <>{value.length > 15 ? getEllipsisTxt(value, 6) : value}</>
                    )}
                    {isCopyable && typeof value === "string" && (isClicked ? <Check /> : <Copy />)}
                </>
            </div>
        </div>
    );
};

export default NftTextDetails;
