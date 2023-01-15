import { Schema, model, models } from "mongoose";

import { isProdEnv } from "../constant";

const collectionName = isProdEnv ? process.env.MONGODB_COLLECTION : process.env.MONGODB_COLLECTION_TEST;

if (!collectionName) {
    throw new Error("MONGODB_COLLECTION or MONGODB_COLLECTION_TEST is not defined");
}

const nftSchema = new Schema({
    amount: {
        type: Number,
        required: true,
    },
    blockNumber: {
        type: String,
        required: true,
    },
    blockNumberMinted: {
        type: String,
        required: true,
        immutable: true,
    },
    chain: {
        type: String || Number,
        required: true,
    },
    contractType: {
        type: String,
        required: true,
        immutable: true,
    },
    lastMetadataSync: {
        type: Date,
        required: true,
    },
    lastTokenUriSync: {
        type: Date,
        required: true,
    },
    name: {
        type: String,
        required: true,
        immutable: true,
    },
    ownerOf: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
        immutable: true,
    },
    tokenAddress: {
        type: String,
        required: true,
        immutable: true,
    },
    tokenHash: {
        type: String,
        required: true,
    },
    tokenId: {
        type: Number,
        required: true,
        immutable: true,
    },
    tokenUri: {
        type: String,
        required: true,
    },
    isStaked: {
        type: Boolean,
        required: true,
        default: false,
    },
});

const NftSchema = isProdEnv
    ? models.lepricon_nft_owners || model(collectionName, nftSchema)
    : models.lepritest_nft_owners || model(collectionName, nftSchema);

export default NftSchema;
