const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()

const Note = require('../models/note')
const User = require('../models/user')

const getTokenFrom = (req) => {
	const authorization = req.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
	  return authorization.substring(7)
	}
	return null
  }
  

userRouter.get('/', async (req,res)=>{
	try{
	const token = getTokenFrom(req)

	const decodedToken = jwt.verify(token, process.env.SECRET)

	if (!token || !decodedToken.id) {
	  return res.status(401).json({ error: 'token missing or invalid' })
	}
  
	const user = await User.findById(decodedToken.id)

		user.populate('notes', { })

		console.log(user)
		
		res.status(200).json(user.notes)
	

	
}catch(error){
	res.status(500).json({error: 'something went wrong'})
}
  
})

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
