import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

import { isProdEnv } from "../../data/constant";
import NftSchema from "../../data/models/nftSchema";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests allowed" });
        return;
    }

    const { owner, nftAddress, nftId, status } = req.body;

    if (!owner || !nftAddress || nftId === undefined || status === undefined) {
        return res.status(400).json({ success: false, message: "Missing parameters" });
    }

    const collection = isProdEnv ? process.env.MONGODB_COLLECTION : process.env.MONGODB_COLLECTION_TEST;
    const mongodbUri = process.env.MONGODB_URI;
    if (!mongodbUri) {
        return res.status(400).json({ success: false, message: "MONGODB_URI is not defined" });
    }

    await mongoose.connect(mongodbUri);
    mongoose.set("strictQuery", false);

    try {
        // Get NFT object from Mongo DB
        const query = {
            collectionName: collection,
            ownerOf: owner.toLowerCase(),
            tokenId: nftId,
            tokenAddress: nftAddress.toLowerCase(),
        };
        const result = await NftSchema.find(query);
        const nft = result[0];

        // Edit & save NFT status in Mongo DB
        nft.isStaked = status;
        await nft.save();

        return res.status(200).json({
            success: true,
            message: "Data updated successfully!",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "An error occured while updating the DB!",
            error,
            data: null,
        });
    }
};

export default handler;
