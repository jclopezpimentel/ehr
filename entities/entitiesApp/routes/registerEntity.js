var express = require('express');
var router = express.Router();
var registerEntityController = require('../controller/registerEntityController');
router.post('/', registerEntityController.registerEntity);
module.exports = router;