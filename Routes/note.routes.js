const express = require("express");
const { auth } = require("../Middleware/auth.middleware");
const { NoteModel } = require("../Models/note.model");

const notesRouter = express.Router();

notesRouter.use(auth);

notesRouter.post("/create", async (req, res) => {
  try {
    const note = new NoteModel(req.body);
    await note.save();
    res.json({ msg: "Note saved!", note });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

notesRouter.get("/", async (req, res) => {
  const { userID } = req.body;

  try {
    const notes = await NoteModel.find({ userID });
    res.json({ notes });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

notesRouter.patch("/update/:noteID", async (req, res) => {
  const { noteID } = req.params;
  const { userID, title, body, category } = req.body;

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
    const note = await NoteModel.findById({ _id: noteID });
    if (note && note.userID == userID) {
      await NoteModel.findByIdAndUpdate({ _id: noteID }, query);
      res.json({ msg: `${note.title} has been updated.` });
    } else {
      res.json({ msg: "Not Authorised." });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

notesRouter.delete("/delete/:noteID", async (req, res) => {
  const { noteID } = req.params;
  try {
    const note = await NoteModel.findOneAndDelete({
      _id: noteID,
      userID: req.body.userID,
    });
    if (note) {
      res.json({ msg: "Note has been deleted.", note });
    } else {
      res.json({ msg: "Not Authorised." });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

module.exports = { notesRouter };
