var express = require('express');
var router = express.Router();
var checkIntegrityEHRChainController = require('../controller/checkIntegrityEHRChainController');

router.get('/', checkIntegrityEHRChainController.checkIntegrityEHRChain);
module.exports = router;
