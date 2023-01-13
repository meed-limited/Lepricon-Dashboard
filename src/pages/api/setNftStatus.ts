import { NextApiRequest, NextApiResponse } from "next";

import { isProdEnv } from "../../data/constant";
import { updateNftStatus } from "../../utils/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const URL_EXTERNAL = process.env.SIGNING_URL; // RestAPI server

    if (req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests allowed" });
        return;
    }

    try {
        const { account, nftContractAddress, tokenId, boost } = req.body;
        console.log(`ACCOUNT "${account}" REQUEST ${boost}% STAKING BOOST...`);

        if (!account || !nftContractAddress || tokenId === undefined || boost === undefined) {
            return res.status(400).json({ success: false, message: "Missing parameters" });
        }

        // 1. Check if account really owns NFT (in case of direct contract interaction)
        const body = JSON.stringify({
            owner: account,
            tokenId: tokenId,
            chain: "ETH",
            network: isProdEnv ? "mainnet" : "testnet",
        });

        const ownership_res = await fetch(`${URL_EXTERNAL}staking/checkOwnership`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.SIGNING_KEY}`,
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: body,
        });

        const ownership = await ownership_res.json();

        if (!ownership.success) {
            return res
                .status(400)
                .json({ success: false, message: "Something went wrong while checking the NFT ownership." });
        }

        if (!ownership.isOwner) {
            return res.status(400).json({ success: false, message: "This account doesn't own this NFT" });
        }

        // 2. Set account boost
        const body2 = JSON.stringify({
            account: account,
            nftContractAddress: nftContractAddress,
            tokenId: tokenId,
            boost: boost,
            chain: "POLYGON",
            network: isProdEnv ? "mainnet" : "testnet",
        });

        const setBoost_res = await fetch(`${URL_EXTERNAL}staking/setBoost`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.SIGNING_KEY}`,
                accept: "application/json",
                "Content-Type": "application/json",
            },
            body: body2,
        });

        const response = await setBoost_res.json();

        if (!response.success) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong during the contract call to update the boost status.",
                data: null,
            });
        }

        updateNftStatus(account, nftContractAddress, tokenId, true);

        console.log(`${boost}% BOOST FOR ACCOUNT ${account} SUCCESSFULLY SET!`);
        return res.status(200).json({
            success: true,
            message: "NFT status updated successfully!",
            data: response,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: "An unexpected error occured while setting the NFT boost.",
            error,
            data: null,
        });
    }
};

export default handler;
