var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
var flash = require('connect-flash');
var passport = require('passport');
require("./config/auth")(passport);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cadastroUsuarios = require('./routes/cadastro_usuarios');
var loginRouter = require('./routes/login');
var userRouter = require('./routes/user');
var logoutRouter = require('./routes/logout');
var amostraRouter = require('./routes/amostra');
var recoverRouter = require('./routes/recover');


var app = express();

//Config session
app.use(session({
  secret: "capture_email5434635476",
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next){
  res.locals.message_success = req.flash("message_success");
  res.locals.message_error = req.flash("message_error");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  res.locals.autor = null;
  res.locals.amostra = null;
  next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/add/user', cadastroUsuarios);
app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/logout', logoutRouter);
app.use('/amostra', amostraRouter);
app.use('/recover', recoverRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
