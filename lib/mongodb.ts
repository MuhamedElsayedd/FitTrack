// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from "mongodb"

if (!process.env.MONGO_URI) {
  throw new Error("Please add your Mongo URI to .env.local")
}

const uri = process.env.MONGO_URI
const options: MongoClientOptions = {
  // Increase timeouts to handle potential network latency
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 60000,
  // Removed 'useUnifiedTopology' as it is no longer needed in newer MongoDB driver versions
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // @ts-ignore
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    // @ts-ignore
    global._mongoClientPromise = client.connect()
      .catch(err => {
        console.error("Failed to connect to MongoDB:", err);
        // Log more details about the connection attempt
        console.error("Connection URI (redacted):", uri.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@"));
        console.error("Connection options:", JSON.stringify(options));
        throw err;
      });
  }
  // @ts-ignore
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
    .catch(err => {
      console.error("Failed to connect to MongoDB:", err);
      throw err;
    });
}

// Export a module-scoped MongoClient promise
export default clientPromise
