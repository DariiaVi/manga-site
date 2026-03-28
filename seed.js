import { connectDB } from "./db.js";
import { mangaData } from "./mangaData.js"; // вынеси объект в отдельный файл

async function seed() {
  const db = await connectDB();

  const mangasCollection = db.collection("mangas");

  // превращаем объект в массив
  const mangasArray = Object.values(mangaData);

  await mangasCollection.insertMany(mangasArray);

  console.log("🌱 Data inserted!");
  process.exit();
}

seed();
