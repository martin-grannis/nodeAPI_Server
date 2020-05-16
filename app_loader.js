const express = require("express");
//const bodyParser = require("body-parser");
const cors = require("cors");

const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport")
require("./config/passport-setup")

const app = express();

//app.use(passport)

const corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
//app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");

db.sequelize.sync();

//require("./routes/users.routes")(app);

// view engine setup
app.set("views", path.join(__dirname, "views/pages"));
app.set("view engine", "pug");

// app.set("views", path.join(__dirname, "views/pages"))
// app.set("view engine", "ejs")


// Set public path
app.use('/stylesheets', express.static(path.join(__dirname + '/public/stylesheets')))
app.use('/', express.static(path.join(__dirname + '/public')))


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users.routes");

app.use("/", indexRouter);
app.use("/api/v1/users", usersRouter);

//app.use('/users', usersRouter);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });


module.exports = app;
