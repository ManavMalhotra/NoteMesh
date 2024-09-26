const config = require("./utils/config");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const notesRouter = require("./controllers/notes");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

console.log("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) =>
    logger.error("Error connecting to MongoDB:", error.message)
  );

app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.status(200).json({ msg: "Hello World" }));
app.use("/api/notes", notesRouter);
app.use("/api/user", userRouter);
app.use("/api/login", loginRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// 	next();
//   });

// if (process.env.NODE_ENV === 'test') {
//   const testingRouter = require('./controllers/testing')
//   app.use('/api/testing', testingRouter)
// }

// app.use(middleware.unknownEndpoint)
// app.use(middleware.errorHandler)

app.listen(config.PORT, () => {
  `Listening on ${config.PORT}`;
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Something went wrong" });
});
