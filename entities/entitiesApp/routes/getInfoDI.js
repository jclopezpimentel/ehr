var express = require('express');
var router = express.Router();
var getInfoDIController = require('../controller/getInfoDIController');

router.get('/', getInfoDIController.getInfoDI);
module.exports = router;
