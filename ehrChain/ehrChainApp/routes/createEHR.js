var express = require('express');
var router = express.Router();
var createEHRController = require('../controller/createEHRController');

router.post('/', createEHRController.createEHR);
module.exports = router;
