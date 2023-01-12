import { NextApiRequest, NextApiResponse } from "next";

import { updateNftStatus } from "../../utils/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return res.status(405).send({ message: "Only POST requests allowed" });
    }

    const { account, nftContractAddress, tokenId, status } = req.body;

    if (!account || !nftContractAddress || tokenId === undefined || status === undefined) {
        return res.status(400).json({ success: false, message: "Missing parameters" });
    }
    try {
        await updateNftStatus(account, nftContractAddress, tokenId, status);
        console.log(`BOOST FOR ACCOUNT ${account} REMOVED SUCCESSFULLY!`);

        return res.status(200).json({
            success: true,
            message: "NFT status removed successfully!",
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
