const express = require("express");
const morgan = require("morgan");
const path = require("path");
const { ValidationError } = require("sequelize");
const {router: indexRouter} = require("./routes/index");
const {router: booksRouter } = require('./routes/books');
const {router: myBooksRouter} = require('./routes/bookshelf');
const usersRouter = require("./routes/users");
const { environment } = require("./config");


const app = express();
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));
app.use(express.json());

//Populate DB Route
const dbPopulateRouter = require('./routes/db-populate');

app.use("/", indexRouter);
app.use('/db-populate', dbPopulateRouter);
app.use("/books", booksRouter);
app.use("/mybooks", myBooksRouter);
app.use("/users", usersRouter);

// Catch unhandled requests and forward to error handler.
app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});

// Error handlers. (must have all four arguments to communicate to Express that
// this is an error-handling middleware function)

// Process sequelize errors
app.use((err, req, res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map((e) => e.message);
    err.title = "Sequelize Error";
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  const isProduction = environment === "production";
  res.json({
    title: err.title || "Server Error",
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;
