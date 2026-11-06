var express = require('express');
var router = express.Router();
var setActiveEntityController = require('../controller/setActiveEntityController');
router.post('/', setActiveEntityController.setActiveEntity);
module.exports = router;
