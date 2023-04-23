const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Note = require("../models/note");
const User = require("../models/user");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization) {
    const token = authorization.split(" ")[1];
    console.log(token);
    return token;
  }
  return null;
};

notesRouter.get("/", async (request, response) => {
  const token = getTokenFrom(request);
  if (token !== "") {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      const notes = await Note.find({}).populate("user", {
        username: 1,
        name: 1,
      });

      const userNotes = notes.filter(
        (note) => note.user._id.toString() === decoded.id
      );
      console.log(userNotes);

      response.status(200).json(userNotes);
    } catch (e) {
      console.log(e);
    }
  } else {
    response.status(404).send("Something went wrong");
  }
});

notesRouter.get("/:id", async (request, response) => {
  const note = await Note.findById(request.params.id);

  if (note) {
    response.status(200).json(note.toJSON());
  } else {
    response.status(404).end();
  }
});

notesRouter.post("/", async (req, res) => {
  const { content } = req.body;
  const token = await getTokenFrom(req);
  const decodeToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodeToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodeToken.id);

  const note = new Note({
    content,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  res.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (request, response) => {
  await Note.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
