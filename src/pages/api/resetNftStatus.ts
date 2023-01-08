import { NextApiRequest, NextApiResponse } from "next";
import { updateNftStatus } from "../../utils/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests allowed" });
        return;
    }

    try {
        const { account, nftContractAddress, tokenId, status } = req.body;

        if (!account || !nftContractAddress || tokenId === undefined || status === undefined) {
            res.status(400).json({ success: false, message: "Missing parameters" });
            return;
        }

        updateNftStatus(account, nftContractAddress, tokenId, status);

        console.log(`BOOST FOR ACCOUNT ${account} REMOVED SUCCESSFULLY!`);
        res.status(200).json({
            success: true,
            message: "NFT status removed successfully!",
            data: null,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "An unexpected error occured while resetting the NFT boost.",
            error,
            data: null,
        });
    }
};

export default handler;
