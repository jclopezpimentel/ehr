var express = require('express');
var router = express.Router();
var consultPController = require('../controller/consultPController');

router.get('/', consultPController.consultP);
module.exports = router;