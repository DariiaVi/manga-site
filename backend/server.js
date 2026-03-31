import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import multer from "multer";
import User from "./User.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

/* ======================
DATABASE
====================== */

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("MongoDB Atlas подключена");
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB ошибка:", err);
});

/* ======================
CORS (ВАЖНО)
====================== */

app.use(
  cors({
    origin: "https://lamp-login-dl7a.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());

/* ======================
STATIC FILES
====================== */

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "..")));

/* ======================
UPLOAD COVER
====================== */

const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images/covers"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadCover = multer({ storage: coverStorage });

/* ======================
UPLOAD PAGES
====================== */

const pagesStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "images/pages"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadPages = multer({ storage: pagesStorage });

/* ======================
MANGA MODEL
====================== */

const mangaSchema = new mongoose.Schema({
  title: String,
  type: String,
  genres: [String],
  description: String,
  cover: String,
});

const Manga = mongoose.model("Manga", mangaSchema, "mangas");

/* ======================
REGISTER
====================== */

app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await User.findOne({ username });

    if (existing) {
      return res.status(400).json({
        message: "Пользователь уже существует",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hash,
      favorites: [],
      readingList: [],
      collections: [],
    });

    await user.save();

    res.json({ message: "Регистрация успешна" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

/* ======================
LOGIN
====================== */

app.post("/api/login", async (req, res) => {
  try {
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Пользователь не найден",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Неверный пароль",
      });
    }

    res.json({
      message: "Вход выполнен",
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

/* ======================
ADD MANGA
====================== */

app.post("/mangas/add", uploadCover.single("cover"), async (req, res) => {
  try {
    const { title, type, genres, description } = req.body;

    const coverPath = "/images/covers/" + req.file.filename;

    const manga = new Manga({
      title,
      type,
      genres: genres.split(","),
      description,
      cover: coverPath,
    });

    await manga.save();

    res.json({ message: "Манга добавлена" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка добавления манги" });
  }
});
/* ======================
FAVORITES
====================== */
app.post("/favorites/add", async (req, res) => {
  try {
    const { username, mangaId } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    // ❗ чтобы не добавлялось дважды
    if (!user.favorites.includes(mangaId)) {
      user.favorites.push(mangaId);
    }

    await user.save();

    res.json({ message: "Добавлено в избранное" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});
app.get("/favorites/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json([]);
    }

    res.json(user.favorites || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});
/* ======================
GET ALL MANGAS
====================== */

app.get("/mangas", async (req, res) => {
  try {
    const mangas = await Manga.find();
    res.json(mangas);
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки манги" });
  }
});

app.get("/collections/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) return res.json([]);

    res.json(user.collections || []);
  } catch (err) {
    res.status(500).json({ error: "Ошибка" });
  }
});
/* ======================
ADD CHAPTER
====================== */

app.post("/chapters/add", uploadPages.array("pages", 200), async (req, res) => {
  try {
    const { mangaId, number, title } = req.body;

    const pages = req.files
      .map((file) => ({
        path: "/" + file.path.replace(/\\/g, "/"),
        name: file.originalname,
      }))
      .sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/));
        const numB = parseInt(b.name.match(/\d+/));
        return numA - numB;
      })
      .map((file) => file.path);

    const chapter = {
      mangaId,
      number,
      title,
      pages,
    };

    await mongoose.connection.collection("pages").insertOne(chapter);

    res.json({ message: "Глава добавлена" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка загрузки главы" });
  }
});

/* ======================
GET CHAPTER PAGES
====================== */

app.get("/pages/:chapterId", async (req, res) => {
  try {
    const chapter = await mongoose.connection
      .collection("pages")
      .findOne({ _id: new mongoose.Types.ObjectId(req.params.chapterId) });

    if (!chapter) return res.json({ pages: [] });

    res.json(chapter);
  } catch (err) {
    res.status(500).json({ error: "Ошибка загрузки страниц" });
  }
});

/* ======================
GET CHAPTERS BY MANGA
====================== */

app.get("/chapters/:mangaId", async (req, res) => {
  try {
    const chapters = await mongoose.connection
      .collection("pages")
      .find({ mangaId: req.params.mangaId })
      .sort({ number: 1 })
      .toArray();

    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: "Ошибка загрузки глав" });
  }
});

/* ======================
TEST
====================== */

app.get("/test", (req, res) => {
  res.json({ message: "server works" });
});

/* ======================
ROOT
====================== */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

/* ======================
START SERVER
====================== */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
