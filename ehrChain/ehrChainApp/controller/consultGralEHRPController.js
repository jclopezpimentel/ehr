var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var chain = require('./blockchain');
var initializer = {};

// GET /consultGralEHRP?gralEHRSC=<address>&publicMethod=<method>&sender=<account>&gas=<gas>&curp=<CURP>
// Methods of GralEHR that receive a CURP: getEHR_SC, getWhoCreatedEHR.
// They are protected by ownerOrGovernment, so sender must be the patient or the government.
initializer.consultGralEHRP = async function (req, res) {
    const [found, functionName, contractABIPath] = listFuncInChain.searchFunctionAndSmartContract(req.query.publicMethod + "GralEHRP");
    let resul = {};
    if (found === "NotFound") {
        resul = utilities.toResult("Error", "11", errorControl.errors("11"));
    } else {
        const obj = {
            body: {
                gralEHRSC: req.query.gralEHRSC,
                sender: req.query.sender,
                gas: req.query.gas,
                curp: req.query.curp
            }
        };
        const errNum = errorControl.someFieldIsEmpty(obj);
        if (errNum) {
            resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
        } else {
            try {
                const value = await chain.call(contractABIPath, obj.body.gralEHRSC, functionName,
                    [obj.body.curp], obj.body.sender, obj.body.gas);
                resul = utilities.toResult("Ok", "0", value);
            } catch (error) {
                resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
            }
        }
    }
    res.send(resul);
}

module.exports = initializer;
