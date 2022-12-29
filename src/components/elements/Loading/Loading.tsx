import { FC } from "react";

import { Spin } from "antd";

import { useSuportedChains } from "../../../hooks";
import { useUserData } from "../../../context/UserContextProvider";

const Loading: FC = () => {
    const { isConnected } = useUserData();
    const isSupportedChain = useSuportedChains();

    return (
        <>
            {isConnected && isSupportedChain && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Spin size="large" tip="Loading..." />
                </div>
            )}
        </>
    );
};

export default Loading;
