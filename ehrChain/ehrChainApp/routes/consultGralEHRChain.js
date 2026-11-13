var express = require('express');
var router = express.Router();
var consultGralEHRChainController = require('../controller/consultGralEHRChainController');

router.get('/', consultGralEHRChainController.consultGralEHRChain);
module.exports = router;
