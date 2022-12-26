import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Response = {
    success: boolean;
    message?: string;
    data: any;
};

const handler = async (_req: NextApiRequest, res: NextApiResponse<Response>) => {
    const CMC_API = process.env.NEXT_PUBLIC_CMC_KEY;
    const symbol = process.env.NEXT_PUBLIC_SYMBOL;
    console.log(`REQUEST PRICE FOR ${symbol}`);

    try {
        const data: any = await axios.get(
            `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbol}`,
            {
                headers: {
                    Accepts: "application/json",
                    "X-CMC_PRO_API_KEY": `${CMC_API}`,
                },
            }
        );

        if (data.status !== 200) {
            res.status(400).json({
                success: false,
                message: "Something went wrong while fetching CMC data.",
                data: null,
            });
            return;
        }

        console.log(`PRICE FOR ${symbol} FETCHED SUCCESSFULLY!`);
        /// TODO: edit the token symbol in the path
        res.status(200).json({ success: true, data: data.data.data.HOT[0].quote.USD.price });
    } catch (err) {
        console.log(err);
    }
};

export default handler;
