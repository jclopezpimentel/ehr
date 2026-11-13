var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var chain = require('./blockchain');
var initializer = {};

// POST /createEHRChain
// body: { functionName: "createEHR", gralEHR_SC, gas, healthCP, birthCerSC, curp }
// A healthcare professional (healthCP, Medicine degree) opens the EHR of a patient.
// The contract checks the CURP against the birth certificate and allows one EHR per CURP.
initializer.createEHRChain = async function (req, res) {
    const [found, functionName, contractABIPath] = listFuncInChain.searchFunctionAndSmartContract(req.body.functionName);
    let resul = {};
    if (found === "NotFound" || functionName !== "createEHR") {
        resul = utilities.toResult("Error", "11", errorControl.errors("11"));
    } else {
        const obj = {
            body: {
                gralEHR_SC: req.body.gralEHR_SC,
                gas: req.body.gas,
                healthCP: req.body.healthCP,
                birthCerSC: req.body.birthCerSC,
                curp: req.body.curp
            }
        };
        const errNum = errorControl.someFieldIsEmpty(obj);
        if (errNum) {
            resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
        } else {
            try {
                const receipt = await chain.send(contractABIPath, obj.body.gralEHR_SC, functionName,
                    [obj.body.birthCerSC, obj.body.curp], obj.body.healthCP, obj.body.gas);
                resul = utilities.toResult("Ok", "0", receipt);
            } catch (error) {
                resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
            }
        }
    }
    res.send(resul);
}

module.exports = initializer;
