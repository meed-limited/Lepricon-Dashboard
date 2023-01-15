import { NextApiRequest, NextApiResponse } from "next";

import { URL } from "../../data/constant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).send({ message: "Only POST requests allowed" });
    }

    const { account, nftContractAddress, tokenId, status } = req.body;

    if (!account || !nftContractAddress || tokenId === undefined || status === undefined) {
        return res.status(400).json({ success: false, message: "Missing parameters" });
    }
    try {
        const body = JSON.stringify({
            owner: account,
            nftAddress: nftContractAddress,
            nftId: tokenId,
            status: status,
        });

        const updateDB_res = await fetch(`${URL}api/updateNft`, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: body,
        });
        const DB_response = await updateDB_res.json();

        console.log(`BOOST FOR ACCOUNT ${account} REMOVED SUCCESSFULLY!`);

        return res.status(200).json({
            success: true,
            message: DB_response.message,
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
