var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
//global variable
global.blockchainAddress = "ws://172.18.1.2:8546";

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var proof = require('./routes/proof');
//GralEHR services
var createGralEHR = require('./routes/createGralEHR');
var createEHR = require('./routes/createEHR');
var consultGralEHR = require('./routes/consultGralEHR');
var consultGralEHRP = require('./routes/consultGralEHRP');
//EHR services
var addEHR = require('./routes/addEHR');
var checkEHR = require('./routes/checkEHR');
var consultEHR = require('./routes/consultEHR');

app.use('/proofEHRChain', proof);
//GralEHR services
app.use('/createGralEHR', createGralEHR);
app.use('/createEHR', createEHR);
app.use('/consultGralEHR', consultGralEHR);
app.use('/consultGralEHRP', consultGralEHRP);
//EHR services
app.use('/addEHR', addEHR);
app.use('/checkEHR', checkEHR);
app.use('/consultEHR', consultEHR);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler (JSON, this service has no views)
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({ Result: "Error", Num: String(err.status || 500), Return: err.message });
});

module.exports = app;
