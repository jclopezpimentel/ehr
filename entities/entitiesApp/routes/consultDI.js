var express = require('express');
var router = express.Router();
var consultDIController = require('../controller/consultDIController');

router.get('/', consultDIController.consultDI);
module.exports = router;
