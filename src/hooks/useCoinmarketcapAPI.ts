import { useEffect, useState } from "react";

import { getTokenData } from "../services/backendCall";

export const useCoinmarketcapAPI = () => {
  const [price, setPrice] = useState<number>();

  useEffect(() => {
    const getPrice = async () => {
      const res = await getTokenData("symbol=LPR");
      if (res) {
        const priceInUsd = res.quote.USD.price;
        setPrice(priceInUsd);
      }
    };
    getPrice();
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { price };
};
