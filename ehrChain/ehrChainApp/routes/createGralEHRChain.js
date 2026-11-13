var express = require('express');
var router = express.Router();
var createGralEHRChainController = require('../controller/createGralEHRChainController');

router.post('/', createGralEHRChainController.createGralEHRChain);
module.exports = router;
