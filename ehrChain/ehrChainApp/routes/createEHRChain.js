var express = require('express');
var router = express.Router();
var createEHRChainController = require('../controller/createEHRChainController');

router.post('/', createEHRChainController.createEHRChain);
module.exports = router;
