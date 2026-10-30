var express = require('express');
var router = express.Router();
var consultEHRController = require('../controller/consultEHRController');

router.get('/', consultEHRController.consultEHR);
module.exports = router;
