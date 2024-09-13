const createError = require('http-errors');
const express = require('express');
require('dotenv').config();

const path = require('path');
const cookieParser = require('cookie-parser');
const requestIp = require('request-ip');
const useragent = require('express-useragent');
const logger = require('morgan');
require('./services/db');

const usersRouter = require('./routes/usersRouter');
const commentRouter = require('./routes/commentRouter');
const videoRouter = require('./routes/videoRouter');
const coachRouter = require('./routes/coachRouter');
const clubRouter = require('./routes/clubRouter');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(requestIp.mw());
app.use(useragent.express());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/users', usersRouter);
app.use("/v1/comment", commentRouter);
app.use("/v1/videos", videoRouter);
app.use("/v1/coach", coachRouter);
app.use("/v1/club", clubRouter);
app.use(function(req, res, next) {
  next(createError(404, 'Resource not found'));
});

app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.error("✌️ Error --->", err.stack);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
