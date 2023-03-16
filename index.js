const config = require('./utils/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const notesRouter = require('./controllers/notes')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');



const cors = require('cors')

console.log('connecting to', config.MONGODB_URI)


mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}));

app.use('/api/notes', notesRouter)
app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/",(req,res)=>{

	let form = `
	<h1>Login</h1>
	<form action="/api/login" method="POST">
		<input type="text" name="username" id="username" placeholder="username"><br>
		<input type="text" name="password" id="password" placeholder="password">
		<input type="submit"></input>
	</form>
	<br>
	<h1>Register</h1>
	<form action="/api/user" method="POST">
		<input type="text" name="name" id="name" placeholder="Name"><br>
		<input type="text" name="username" id="username" placeholder="username"><br>
		<input type="text" name="password" id="password" placeholder="password">
		
		<input type="submit"></input>
	</form>
	<br>
	<form action="/api/notes" method="POST">
		<input type="text" name="content" id="content" placeholder="content"><br>
		<input type="text" name="important" id="important" placeholder="important">
		
		<input type="submit"></input>
	</form>`
	res.send(form)
})

// if (process.env.NODE_ENV === 'test') {
//   const testingRouter = require('./controllers/testing')
//   app.use('/api/testing', testingRouter)
// }

// app.use(middleware.unknownEndpoint)
// app.use(middleware.errorHandler)

app.listen(config.PORT,()=>{`Listening on ${config.PORT}`})