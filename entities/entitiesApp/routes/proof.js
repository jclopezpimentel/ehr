var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send("Returning: route /proof entities");
});

/*
const proofe = '/proofe';
router.get(proofe, function(req, res, next) {
  res.send("Returning: route /proofe entities");
});
*/

module.exports = router;
