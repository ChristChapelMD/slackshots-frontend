import mongoose from "mongoose";

declare global {
  var mongoose:
    | {
        conn: mongoose.Connection | null;
        promise: Promise<mongoose.Connection> | null;
      }
    | undefined;
}

let cached = global.mongoose!;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const DB_CONN_URL = process.env.MONGO_URI as string;

    cached.promise = mongoose
      .connect(DB_CONN_URL)
      .then((mongoose) => mongoose.connection);
  }
  cached.conn = await cached.promise;

  return cached.conn;
}
