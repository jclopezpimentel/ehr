var express = require('express');
var router = express.Router();
var consultGralEHRChainPController = require('../controller/consultGralEHRChainPController');

router.get('/', consultGralEHRChainPController.consultGralEHRChainP);
module.exports = router;
