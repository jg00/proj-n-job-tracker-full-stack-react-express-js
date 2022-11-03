require("dotenv").config();
require("express-async-errors");

const path = require("path");

// extra security packages
const helmet = require("helmet");
const xss = require("xss-clean");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
// routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// needed once app pushed to heroku
app.set("trust proxy", 1);

app.use(express.static(path.resolve(__dirname, "./client/build")));

app.use(express.json());
app.use(helmet());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

/* Serve index.html for all routes that are not part of our api.
  Note our React frontend has react-router-dom that will handle navigate page components on the client side once index.html has been served.
  API requests are handled here on the server and for any GET routes not part of our api we serve the index.html
*/
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware); // At this point if an asset for a page doesn't exists then handled here.
app.use(errorHandlerMiddleware); // Invoked only from within one of the actual existing route

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();