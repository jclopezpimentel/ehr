var express = require('express');
var router = express.Router();
var addEHRChainController = require('../controller/addEHRChainController');

router.post('/', addEHRChainController.addEHRChain);
module.exports = router;
