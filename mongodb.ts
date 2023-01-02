import { MongoClient } from "mongodb";

declare global {
    var mongo: Promise<MongoClient>;
}

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

if (!process.env.MONGODB_DB) {
    throw new Error("Please define the MONGODB_DB environment variable inside .env.local");
}

const uri = process.env.MONGODB_URI;
const db = process.env.MONGODB_DB;
const options = {};

let cached = global.mongo;
let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!cached) {
        client = new MongoClient(uri, options);
        cached = client.connect();
    }
    clientPromise = cached;
    console.log("Connected to MongoDB", client);
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
