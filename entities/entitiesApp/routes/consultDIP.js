var express = require('express');
var router = express.Router();
var consultDIPController = require('../controller/consultDIPController');

router.get('/', consultDIPController.consultDIP);
module.exports = router;
