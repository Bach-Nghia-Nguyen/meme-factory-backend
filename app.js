const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const utilsHelper = require("./helpers/utils.helper");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);

// Catch 404 error
app.use((req, res, next) => {
  const error = new Error("Resource not found");
  error.statusCode = 404;
  next(error);
});

// Error handler

app.use((err, req, res, next) => {
  utilsHelper.sendResponse(
    res,
    err.statusCode || 500,
    false,
    null,
    { message: err.message },
    "Internal Server Error"
  );
});

module.exports = app;
