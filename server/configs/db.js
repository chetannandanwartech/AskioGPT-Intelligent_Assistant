import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = (process.env.MONGODB_URI || "").trim().replace(/^["']|["']$/g, "");

    if (!uri) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    mongoose.connection.on("connected", () => console.log("[DB] Database connected"));
    mongoose.connection.on("error", (err) => console.error("[DB] Connection error:", err.message));
    mongoose.connection.on("disconnected", () => console.warn("[DB] Database disconnected"));

    await mongoose.connect(`${uri}/quickgpt`);
  } catch (error) {
    console.error("[DB] Failed to connect:", error.message);
    process.exit(1); // Exit process on DB connection failure
  }
};

export default connectDB;