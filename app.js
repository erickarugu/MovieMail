var createError = require('http-errors');
var express = require('express');
var path = require('path');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// load config
dotenv.config();

// connect to db
connectDB();

var app = express();

// logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Handle Bars
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set("view engine", ".hbs");


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', usersRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`));

