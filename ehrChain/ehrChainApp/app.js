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

// End-points of Table 8 (EHRChain) of the paper
var proof = require('./routes/proof');
//GralEHR services
var createGralEHRChain = require('./routes/createGralEHRChain');
var createEHRChain = require('./routes/createEHRChain');
var consultGralEHRChain = require('./routes/consultGralEHRChain');
var consultGralEHRChain_P = require('./routes/consultGralEHRChain_P');
//EHR services
var addEHRChain = require('./routes/addEHRChain');
var checkIntegrityEHRChain = require('./routes/checkIntegrityEHRChain');
var consultEHRChain = require('./routes/consultEHRChain');

app.use('/proofEHRChain', proof);
//GralEHR services
app.use('/createGralEHRChain', createGralEHRChain);
app.use('/createEHRChain', createEHRChain);
app.use('/consultGralEHRChain', consultGralEHRChain);
app.use('/consultGralEHRChain_P', consultGralEHRChain_P);
//EHR services
app.use('/addEHRChain', addEHRChain);
app.use('/checkIntegrityEHRChain', checkIntegrityEHRChain);
app.use('/consultEHRChain', consultEHRChain);

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
