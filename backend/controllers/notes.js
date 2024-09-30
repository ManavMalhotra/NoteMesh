const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Note = require("../models/note");
const User = require("../models/user");
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

const prompt = `You are a note organizer bot that must respond exclusively with valid JSON. Your task is to analyze the provided note and suggest 2-3 relevant tags based on the content. If the note contains only a website link, return a tag with the website name. Ensure there is no additional formatting, no wrapping (e.g., msg), and no line breaks or escape characters. The response must be clean, valid, and directly parsable JSON Only respond with valid JSON think twice and like this example 
Output format example:
{ "tags": ["example_tag_1", "example_tag_2"] }
If it's only a website link:
{"tags": ["website_name"]}
`;

async function getTagSuggestion(content) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are an assistant that helps to generate note tags in a clean, structured JSON format.",
      },
      {
        role: "user",
        content:
          'You are an API that organizes and tags notes. Analyze the provided note and suggest 2-3 relevant tags based solely on the content. Respond only in JSON format. If the content is clear, suggest tags. If it is insufficient or just a website link, suggest a tag for the website if you found any link then you should mandatory give website name as a tag. Do not guess or hallucinate. Output format:{"tags": ["example_tag_1", "example_tag_2"]}{"tags": ["website_name"]}',
      },
      {
        role: "user",
        content: `Here is the note content: ${content}`,
      },
    ],
    model: "mixtral-8x7b-32768",
    response_format: { type: "json_object" },
  });
}

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
  console.log("saving notes ....");
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
    console.log("Error at POST route: " + error);
    res.status(500).json({ error: "something went wrong" });
  }
});

notesRouter.post("/tag-suggestion", async (req, res) => {
  const token = getTokenFrom(req);
  if (!token) {
    return res.status(401).json({ error: "token missing" });
  }

  const decoded = jwt.verify(token, process.env.SECRET);
  if (!decoded.id) {
    return res.status(401).json({ error: "invalid token" });
  }

  const { content } = req.body;
  // console.log(content)

  const chatCompletion = await getTagSuggestion(content);

  const result = JSON.parse(chatCompletion.choices[0]?.message?.content || {});
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");

  res.status(200).json({
    msg: result,
  });
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
