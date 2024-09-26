const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userRouter = require("express").Router();

const Note = require("../models/note");
const User = require("../models/user");

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

// GET users with token verification
userRouter.get("/", async (req, res) => {
  try {
    const token = getTokenFrom(req);
    if (!token) {
      return res.status(401).json({ error: "token missing" });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken.id) {
      return res.status(401).json({ error: "invalid token" });
    }

    const users = await User.find({}).populate("notes", {
      content: 1,
      date: 1,
    });
    res.status(200).json(users);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "invalid token" });
    }
    res.status(500).json({ error: "something went wrong" });
  }
});

// POST route: Create a new user
userRouter.post("/", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // Validate input data
    if (!username || !password || !name) {
      return res
        .status(400)
        .json({ error: "Username, password, and name are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username must be unique" });
    }

    // Hash the password before saving
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = userRouter;
