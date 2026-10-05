var express = require('express');
var router = express.Router();
var linkContractController = require('../controller/linkContractController');
router.post('/', linkContractController.linkContract);
module.exports = router;