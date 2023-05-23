const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 2
  },
  content: {
    type: String,
    minlength: 5
  },
  date: Date,
  important: Boolean,
  tags:{
    type: [String],
    default : []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Note', noteSchema)