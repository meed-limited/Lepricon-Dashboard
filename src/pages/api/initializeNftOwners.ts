import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { getContractAddresses, isProdEnv } from "../../data/constant";
import { saveMany } from "../../utils/db";
import NftSchema from "../../data/models/nftSchema";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    await mongoose.connect(process.env.MONGODB_URI!);
    mongoose.set("strictQuery", false);
    const { nft } = getContractAddresses();

    const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
    const moralisChain = isProdEnv ? EvmChain.ETHEREUM : EvmChain.GOERLI;

    // Start Moralis
    if (!Moralis.Core.isStarted) {
        await Moralis.start({
            apiKey: `${MORALIS_API_KEY}`,
        });
    }

    try {
        console.log(`REQUEST NFT OWNERS LIST FOR LEPRICON NFTs`);
        const response = await Moralis.EvmApi.nft.getNFTOwners({
            address: nft,
            chain: moralisChain,
        });

        console.log(`LEPRICON NFT OWNERS LIST SUCCESSFULLY FETCHED!`);

        console.log(`START MONGO_DB UPDATE...`);
        if (response && response.result && response.result.length !== 0) {
            saveMany(response.result);
            // isFetched = true;
            // mongoose.disconnect();

            const result = await NftSchema.find();

            res.status(200).json({
                success: true,
                message: "Data inserted successfully!",
                data: [response.result, result],
            });
        }
    } catch (error) {
        console.error(error);
        // res.status(400).json({
        //     success: false,
        //     message: "An error occured while updating the DB!",
        //     data: null,
        // });
    }
};

export default handler;

// import clientPromise from "../../lib/mongodb";
// export default async (req, res) => {
//    try {
//        const client = await clientPromise;
//        const db = client.db("sample_mflix");

//        const movies = await db
//            .collection("movies")
//            .find({})
//            .sort({ metacritic: -1 })
//            .limit(10)
//            .toArray();

//        res.json(movies);
//    } catch (e) {
//        console.error(e);
//    }
// };