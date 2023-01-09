import { FC } from "react";

import { Spin } from "antd";

import { useUserData } from "../../../context/UserContextProvider";
import { useSuportedChains } from "../../../hooks";

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
