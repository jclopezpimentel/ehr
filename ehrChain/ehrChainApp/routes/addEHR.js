var express = require('express');
var router = express.Router();
var addEHRController = require('../controller/addEHRController');

router.post('/', addEHRController.addEHR);
module.exports = router;
