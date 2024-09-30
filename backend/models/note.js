const mongoose = require("mongoose");

// Define the Note schema
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
    minlength: 5,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  important: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Note", noteSchema);
