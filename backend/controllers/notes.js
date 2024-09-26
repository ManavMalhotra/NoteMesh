const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Note = require("../models/note");
const User = require("../models/user");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

// GET all notes for authenticated user
notesRouter.get("/", async (req, res) => {
  try {
    const token = getTokenFrom(req);
    if (!token) {
      return res.status(401).json({ error: "token missing" });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    if (!decoded.id) {
      return res.status(401).json({ error: "invalid token" });
    }

    const notes = await Note.find({}).populate("user", {
      username: 1,
      name: 1,
    });

    const userNotes = notes.filter(
      (note) => note.user._id.toString() === decoded.id
    );
    res.status(200).json(userNotes);
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

// GET specific note by ID
notesRouter.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note) {
      res.status(200).json(note.toJSON());
    } else {
      res.status(404).json({ error: "note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST create a new note
notesRouter.post("/", async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const token = getTokenFrom(req);

    if (!token) {
      return res.status(401).json({ error: "token missing" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "invalid token" });
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    const note = new Note({
      title,
      content,
      tags,
      date: new Date(),
      user: user._id,
    });

    const savedNote = await note.save();
    user.notes = user.notes.concat(savedNote._id);
    await user.save();

    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

// DELETE a note by ID
notesRouter.delete("/:id", async (req, res) => {
  try {
    await Note.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

// PUT update a note by ID
notesRouter.put("/:id", async (req, res) => {
  try {
    const { title, content, tags, important } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, important },
      { new: true }
    );

    if (updatedNote) {
      res.status(200).json(updatedNote);
    } else {
      res.status(404).json({ error: "note not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "something went wrong" });
  }
});

module.exports = notesRouter;
