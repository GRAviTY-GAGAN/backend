const mongoose = require("mongoose");

const notesSchema = mongoose.Schema(
  {
    title: String,
    body: String,
    user: String,
    category: String,
    userID: String,
  },
  { versionKey: false }
);

const NoteModel = mongoose.model("note", notesSchema);

module.exports = { NoteModel };
