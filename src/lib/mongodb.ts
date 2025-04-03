import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URL;
const options = {};

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};


let client: MongoClient;

const clientPromise: Promise<MongoClient> = globalWithMongo._mongoClientPromise?? new MongoClient(url!, options).connect();

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(url!, options);
  globalWithMongo._mongoClientPromise = client.connect();
}

export default clientPromise;