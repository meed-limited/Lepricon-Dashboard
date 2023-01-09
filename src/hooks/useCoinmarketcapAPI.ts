import { useEffect, useState } from "react";

import { URL } from "../data/constant";

export const useCoinmarketcapAPI = () => {
    const [price, setPrice] = useState<number>(0);

    const getPrice = async () => {
        const res: Response = await fetch(`${URL}/api/getTokenPrice`);
        const data = await res.json();
        if (data.success) {
            const priceInUsd = data.data.toFixed(4);
            setPrice(priceInUsd);
        } else {
            console.error(data.message);
            setPrice(0);
        }
    };

    useEffect(() => {
        getPrice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [URL]);

    return { price };
};
