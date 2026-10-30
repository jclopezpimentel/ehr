var express = require('express');
var router = express.Router();
var consultGralEHRController = require('../controller/consultGralEHRController');

router.get('/', consultGralEHRController.consultGralEHR);
module.exports = router;
