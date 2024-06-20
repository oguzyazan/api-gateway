export {};

import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      dbName: "Gateway",
    });
  } catch (err) {
    console.log(err);
  }
}

export { connectDB };
