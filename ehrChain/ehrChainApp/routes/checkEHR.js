var express = require('express');
var router = express.Router();
var checkEHRController = require('../controller/checkEHRController');

router.get('/', checkEHRController.checkEHR);
module.exports = router;
