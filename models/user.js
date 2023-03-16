const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
	username: String,
	name: String,
	passwordHash: String,
	notes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Note'
		}

	]

})

const User = mongoose.model('User', userSchema)

module.exports = User
