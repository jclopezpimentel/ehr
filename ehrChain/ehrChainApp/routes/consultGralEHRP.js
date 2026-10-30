var express = require('express');
var router = express.Router();
var consultGralEHRPController = require('../controller/consultGralEHRPController');

router.get('/', consultGralEHRPController.consultGralEHRP);
module.exports = router;
