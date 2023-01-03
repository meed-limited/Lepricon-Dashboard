import mongoose from "mongoose";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { isProdEnv } from "../../data/constant";
import { useReadContract } from "../../hooks";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { checkNftOwnership } = useReadContract();

    await mongoose.connect(process.env.MONGODB_URI!);
    mongoose.set("strictQuery", false);

    try {
        const { account, nftContractAddress, tokenId, boost } = req.body;
        console.log(`ACCOUNT "${account}" REQUEST ${boost}% STAKING BOOST...`);

        if (!account || !nftContractAddress || !tokenId || !boost) {
            res.status(400).json({ success: false, message: "Missing parameters" });
            return;
        }

        // 1. Check if account really owns NFT (in case of direct contract interaction)
        const isOwner = await checkNftOwnership(account, tokenId);
        if (!isOwner) {
            res.status(400).json({ success: false, message: "This account doesn't own this NFT" });
            return;
        }

        // 2. Set account boost
        const body = JSON.stringify({
            account: account,
            nftContractAddress: nftContractAddress,
            tokenId: tokenId,
            boost: boost,
            chain: "POLYGON",
            network: isProdEnv ? "mainnet" : "testnet",
        });

        const response = await axios.post(`${process.env.SIGNING_URL}/nft/setBoost`, body, {
            headers: {
                Authorization: `Bearer ${process.env.SIGNING_KEY}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.data.success) {
            res.status(400).json({
                success: false,
                message: "Something went wrong during the contract call to update the boost status.",
                data: null,
            });
            return;
        }

        console.log(`${boost}% BOOST FOR ACCOUNT ${account} SUCCESSFULLY SET!`);
        res.status(200).json({
            success: true,
            message: "NFT status updated successfully!",
            data: response.data,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "An unexpected error occured while setting the NFT boost.",
            error,
            data: null,
        });
    }
};

export default handler;

// const query =
// const result = await NftSchema.find();
