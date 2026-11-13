var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var chain = require('./blockchain');
var hashes = require('./hashes');
var initializer = {};

// POST /addEHRChain
// body: { functionName: "addHealthRecord", EHR_SC, gas, sender, idH, titleH, sectionH, details }
// Stores the hashes of a health record in the EHR of a patient. The hashes arrive already
// computed (Protocol 3: the EHR microservice computes them); EHRChain only checks their format.
// sender must be a healthcare professional (Medicine degree).
initializer.addEHRChain = async function (req, res) {
    const [found, functionName, contractABIPath] = listFuncInChain.searchFunctionAndSmartContract(req.body.functionName);
    let resul = {};
    if (found === "NotFound" || functionName !== "addHealthRecord") {
        resul = utilities.toResult("Error", "11", errorControl.errors("11"));
    } else {
        const obj = {
            body: {
                EHR_SC: req.body.EHR_SC,
                gas: req.body.gas,
                sender: req.body.sender,
                idH: req.body.idH,
                titleH: req.body.titleH,
                sectionH: req.body.sectionH,
                details: req.body.details
            }
        };
        const b = obj.body;
        const errNum = errorControl.someFieldIsEmpty(obj);
        if (errNum) {
            resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
        } else if (!hashes.areBytes32([b.idH, b.titleH, b.sectionH, b.details])) {
            resul = utilities.toResult("Error", "14", errorControl.errors(14));
        } else {
            try {
                const receipt = await chain.send(contractABIPath, b.EHR_SC, functionName,
                    [b.idH, b.titleH, b.sectionH, b.details], b.sender, b.gas);
                resul = utilities.toResult("Ok", "0", receipt);
            } catch (error) {
                resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
            }
        }
    }
    res.send(resul);
}

module.exports = initializer;
