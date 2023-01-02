import NftSchema from "../data/models/nftSchema";

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
