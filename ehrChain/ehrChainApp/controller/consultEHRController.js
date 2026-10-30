var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var chain = require('./blockchain');
var initializer = {};

// GET /consultEHR?ehrSC=<address>&publicMethod=<method>&requester=<account>
// Public attributes / methods of an EHR without params:
// owner, government, nameContract, dateCreation, dateLastUpdate, getBirthCertificate
// (requester is accepted to keep the same shape as consultEntity, it is not used)
initializer.consultEHR = async function (req, res) {
    const [found, functionName, contractABIPath] = listFuncInChain.searchFunctionAndSmartContract(req.query.publicMethod + "EHR");
    let resul = {};
    if (found === "NotFound") {
        resul = utilities.toResult("Error", "11", errorControl.errors("11"));
    } else {
        const obj = { body: { ehrSC: req.query.ehrSC } };
        const errNum = errorControl.someFieldIsEmpty(obj);
        if (errNum) {
            resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
        } else {
            try {
                const value = await chain.call(contractABIPath, obj.body.ehrSC, functionName, []);
                resul = utilities.toResult("Ok", "0", value);
            } catch (error) {
                resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
            }
        }
    }
    res.send(resul);
}

module.exports = initializer;
