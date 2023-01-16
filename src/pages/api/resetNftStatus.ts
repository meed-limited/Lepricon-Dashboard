import { NextApiRequest, NextApiResponse } from "next";

import { isProdEnv } from "../../data/constant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const URL_EXTERNAL = process.env.SIGNING_URL;

    if (req.method !== "POST") {
        return res.status(405).send({ message: "Only POST requests allowed" });
    }

    const { account, nftContractAddress, tokenId, status } = req.body;

    if (!account || !nftContractAddress || tokenId === undefined || status === undefined) {
        return res.status(400).json({ success: false, message: "Missing parameters" });
    }

    try {
        const body = JSON.stringify({
            account: account,
            nftContractAddress: nftContractAddress,
            tokenId: tokenId,
            status: status,
            chain: "POLYGON",
            network: isProdEnv ? "mainnet" : "testnet",
        });

        const response = await fetch(`${URL_EXTERNAL}staking/resetBoost`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.SIGNING_KEY}`,
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: body,
        });
        const data = await response.json();

        console.log(`BOOST FOR ACCOUNT ${account} REMOVED SUCCESSFULLY!`);

        return res.status(200).json({
            success: true,
            message: data.message,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: "An unexpected error occured while updating the NFT status.",
            error: error.message,
        });
    }
};

export default handler;
