import { isProdEnv } from "../data/constant";
import NftSchema from "../data/models/nftSchema";

const collection = isProdEnv ? process.env.MONGO_DB_COLLECTION : process.env.MONGO_DB_COLLECTION_TEST;

export const saveMany = (data: EvmNft[]) => {
    data.forEach(async (el: EvmNft) => {
        await NftSchema.create({
            amount: Number(el.amount),
            blockNumber: el.blockNumber.toString(),
            blockNumberMinted: el.blockNumberMinted.toString(),
            chain: el.chain.format(),
            contractType: el.contractType?.toString(),
            lastMetadataSync: el.lastMetadataSync,
            lastTokenUriSync: el.lastTokenUriSync,
            name: el.name?.toString(),
            ownerOf: el.ownerOf.format(),
            symbol: el.symbol?.toString(),
            tokenAddress: el.tokenAddress.format(),
            tokenHash: el.tokenHash?.toString(),
            tokenId: Number(el.tokenId),
            tokenUri: el.tokenUri?.toString(),
            isStaked: false,
        });
    });
};

export const updateNftStatus = async (owner: string, nftAddress: string, nftId: number, status: boolean) => {
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
};
