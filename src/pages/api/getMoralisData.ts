import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";
import { NextApiRequest, NextApiResponse } from "next";

import { getContractAddresses, isProdEnv } from "../../data/constant";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { nft } = getContractAddresses();

    const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
    if (!MORALIS_API_KEY) {
        return res.status(400).json({ success: false, message: "MORALIS_API_KEY is not defined" });
    }
    const moralisChain = isProdEnv ? EvmChain.ETHEREUM : EvmChain.GOERLI;

    // Start Moralis
    if (!Moralis.Core.isStarted) {
        await Moralis.start({
            apiKey: MORALIS_API_KEY,
        });
    }

    try {
        const { account } = req.body;

        if (!account) {
            res.status(400).json({ success: false, message: "Missing parameters" });
            return;
        }
        console.log(`REQUEST MORALIS DATA FOR USER ${account}`);

        // Fetch user NFTs
        const tx = await Moralis.EvmApi.nft.getWalletNFTs({
            address: account,
            chain: moralisChain,
            tokenAddresses: [nft],
        });
        const userNfts = { result: tx.raw.result, total: tx.raw.total, nft: nft, isProdEnv: isProdEnv };

        // Fetch user native's balance
        const response_Native = await Moralis.EvmApi.balance.getNativeBalance({
            address: account,
            chain: moralisChain,
        });

        const nativeBalance = response_Native.raw.balance;

        res.status(200).json({
            success: true,
            message: "Moralis data fetched successfully!",
            data: { userNfts: userNfts, nativeBalance: nativeBalance },
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: "An error occured while updating the DB!",
            data: null,
        });
    }
};

export default handler;
