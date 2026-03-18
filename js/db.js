import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

export async function connectDB() {
  await client.connect();
  console.log("✅ MongoDB connected");
  return client.db("mangaDB"); // вот здесь мы выбираем базу
}
