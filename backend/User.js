import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  favorites: [String],
  readingList: [
    {
      mangaId: String,
      status: String,
      progress: Number,
    },
  ],
  collections: [
    {
      name: String,
      mangas: [String],
    },
  ],
});

export default mongoose.model("User", userSchema);
