var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var chain = require('./blockchain');
var initializer = {};

// GET /consultGralEHRChain?gralEHR_SC=<address>&publicMethod=<functionName>&sender=<account>
// <functionName>: owner, government, nameContract, dateCreation, dateLastUpdate
initializer.consultGralEHRChain = async function (req, res) {
    const [found, functionName, contractABIPath] = listFuncInChain.searchFunctionAndSmartContract(req.query.publicMethod + "GralEHRChain");
    let resul = {};
    if (found === "NotFound") {
        resul = utilities.toResult("Error", "11", errorControl.errors("11"));
    } else {
        const obj = { body: { gralEHR_SC: req.query.gralEHR_SC, sender: req.query.sender } };
        const errNum = errorControl.someFieldIsEmpty(obj);
        if (errNum) {
            resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
        } else {
            try {
                const value = await chain.call(contractABIPath, obj.body.gralEHR_SC, functionName, [], obj.body.sender);
                resul = utilities.toResult("Ok", "0", value);
            } catch (error) {
                resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
            }
        }
    }
    res.send(resul);
}

module.exports = initializer;
