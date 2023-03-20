const config = require('./utils/config')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const notesRouter = require('./controllers/notes')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const cors = require('cors')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

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
app.use(express.urlencoded({ extended: true }));

app.use('/api/notes', notesRouter)
app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
  });
  

// if (process.env.NODE_ENV === 'test') {
//   const testingRouter = require('./controllers/testing')
//   app.use('/api/testing', testingRouter)
// }

// app.use(middleware.unknownEndpoint)
// app.use(middleware.errorHandler)

app.listen(config.PORT,()=>{`Listening on ${config.PORT}`})