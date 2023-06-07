const express = require("express");
const { auth } = require("../Middleware/auth.middleware");
const { NoteModel } = require("../Models/note.model");

const notesRouter = express.Router();

notesRouter.use(auth);

notesRouter.post("/create", async (req, res) => {
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.json({ msg: "New note has been added", note });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

notesRouter.get("/", async (req, res) => {
  try {
    const notes = await NoteModel.find({ userID: req.body.userID });
    res.json({ notes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

notesRouter.patch("/update/:noteID", async (req, res) => {
  const { title, body, category } = req.body;
  const query = {};

  if (title) {
    query.title = title;
  }

  if (body) {
    query.body = body;
  }

  if (category) {
    query.category = category;
  }

  try {
    let note = await NoteModel.findOneAndUpdate(
      {
        _id: req.params.noteID,
        userID: req.body.userID,
      },
      query //or req.body;
    );
    if (note) {
      res.json({ msg: "Note update!", note });
    } else {
      res.json({ msg: "Note update unsuccessful." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

notesRouter.delete("/delete/:noteID", async (req, res) => {
  try {
    const deleted = await NoteModel.findOneAndDelete({
      _id: req.params.noteID,
      userID: req.body.userID,
    });

    if (deleted) {
      res.json({ msg: "Note deleted!" });
    } else {
      res.json({ msg: "Note deletion was unsuccessful." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = { notesRouter };
