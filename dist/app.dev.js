"use strict";

require('dotenv').config();

var createError = require('http-errors');

var express = require('express');

var path = require('path');

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var logger = require('morgan');

var passport = require('passport');

var _require = require('mongodb'),
    MongoClient = _require.MongoClient;

var fileUpload = require('express-fileupload');

require('./app_api/models/db');

require('./app_api/config/passport');

var indexRouter = require('./app_server/routes/index');

var apiRouter = require('./app_api/routes/index');

var usersRouter = require('./app_server/routes/users');

var app = express();
app.locals.moment = require('moment'); // view engine setup

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json({
  limit: '50mb'
}));
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use('/api', function (req, res, next) {
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, Accept,Authorization');
  next();
});
app.use('/', function (req, res, next) {
  res.header('Content-Type, Accept,Authorization');
  next();
});
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter); // catch 404 and forward to error handler

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.redirect('/signin?msg=10112');
  } else {
    next(createError(404));
    console.log(err);
  }
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
});
var uri = "mongodb+srv://karthikeyan:incorrect2003ds@cluster0.hwzvw.mongodb.net/FantomVerse?retryWrites=true&w=majority";
var client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
client.connect(function (err) {
  client.close();
});
module.exports = app;