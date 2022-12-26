import { FC } from "react";
import { useCoinmarketcapAPI } from "../../../hooks/useCoinmarketcapAPI";

const Pool: FC = () => {
    const { price } = useCoinmarketcapAPI();
    return (
        <>
            LP staking Coming soon
            {price}
        </>
    );
};

export default Pool;
