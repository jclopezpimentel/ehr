var express = require('express');
var router = express.Router();
var consultEHRChainController = require('../controller/consultEHRChainController');

router.get('/', consultEHRChainController.consultEHRChain);
module.exports = router;
