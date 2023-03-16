const bcrypt = require('bcrypt')
const userRouter = require('express').Router()

const Note = require('../models/note')
const User = require('../models/user')

userRouter.get('/', async (req,response)=>{
	const users = await User
    .find({})
    .populate('notes', { content: 1, date: 1 })

  response.status(200).json(users)

})

userRouter.post('/', async (req,response)=>{

	const {name,username,password} = req.body;

	const existingUser = await User.findOne({ username })

	if (existingUser) {
		return response.status(400).json({
      	error: 'username must be unique'
    })
  }

	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password,saltRounds)

	const user = new User({
		username,
		name,
		passwordHash
	})

	const savedUser = await user.save()
	response.status(201).json(savedUser)

})

module.exports = userRouter
