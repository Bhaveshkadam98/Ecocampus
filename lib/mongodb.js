
// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

let cached = global._mongo;
if (!cached) cached = global._mongo = { conn: null, promise: null };

export default async function connectToDatabase() {
  if (cached.conn) {
    // quick verification log (remove in production)
    // console.log("Already connected to DB:", mongoose.connection.name);
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "eco-campus-tracker", // <-- force DB name here
      serverSelectionTimeoutMS: 10000,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(m => m);
  }

  try {
    cached.conn = await cached.promise;
    // helpful verification (remove in production)
    console.log("Connected to MongoDB DB:", mongoose.connection.name);
    return cached.conn;
  } catch (err) {
    console.error("Mongo connect error:", err);
    cached.promise = null;
    throw err;
  }
}
