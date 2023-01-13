import type { NextApiRequest, NextApiResponse } from "next";

type Response = {
    success: boolean;
    message?: string;
    data: any;
};

const handler = async (_req: NextApiRequest, res: NextApiResponse<Response>) => {
    const CMC_API = process.env.CMC_KEY;
    const symbol = process.env.SYMBOL;
    const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbol}`;
    console.log(`REQUEST PRICE FOR ${symbol}`);

    try {
        const response: any = await fetch(url, {
            method: "GET",
            headers: {
                "X-CMC_PRO_API_KEY": `${CMC_API}`,
                accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        console.log(response);
        if (response.status !== 200) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong while fetching CMC data.",
                data: null,
            });
        }

        const data = await response.json();
        console.log(`PRICE FOR ${symbol} FETCHED SUCCESSFULLY!`);

        /// TODO: edit the token symbol in the path
        return res.status(200).json({ success: true, data: data.data.HOT[0].quote.USD.price });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err.message,
            data: null,
        });
    }
};

export default handler;
