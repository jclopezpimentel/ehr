var express = require('express');
var router = express.Router();
var createGralEHRController = require('../controller/createGralEHRController');

router.post('/', createGralEHRController.createGralEHR);
module.exports = router;
