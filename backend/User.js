import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  favorites: [
    {
      type: String,
    },
  ],
  readingList: {
    reading: [String],
    planned: [String],
    completed: [String],
    dropped: [String],
  },
  collections: [
    {
      name: String,
      mangas: [String],
    },
  ],
});

export default mongoose.model("User", userSchema);
