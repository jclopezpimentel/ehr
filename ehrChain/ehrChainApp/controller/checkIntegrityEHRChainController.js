var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var chain = require('./blockchain');
var hashes = require('./hashes');
var initializer = {};

// GET /checkIntegrityEHRChain?functionName=cEHRIntegrity&EHR_SC=<address>&gas=<gas>&sender=<account>
//                            &idH=<bytes32>&titleH=<bytes32>&sectionH=<bytes32>&details=<bytes32>
// Asks the EHR if the four hashes match a stored health record.
// Returns true only when the record exists and nothing was altered.
initializer.checkIntegrityEHRChain = async function (req, res) {
    const [found, functionName, contractABIPath] = listFuncInChain.searchFunctionAndSmartContract(req.query.functionName);
    let resul = {};
    if (found === "NotFound" || functionName !== "checkEHRIntegrity") {
        resul = utilities.toResult("Error", "11", errorControl.errors("11"));
    } else {
        const obj = {
            body: {
                EHR_SC: req.query.EHR_SC,
                gas: req.query.gas,
                sender: req.query.sender,
                idH: req.query.idH,
                titleH: req.query.titleH,
                sectionH: req.query.sectionH,
                details: req.query.details
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
                const value = await chain.call(contractABIPath, b.EHR_SC, functionName,
                    [b.idH, b.titleH, b.sectionH, b.details], b.sender, b.gas);
                resul = utilities.toResult("Ok", "0", value);
            } catch (error) {
                resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
            }
        }
    }
    res.send(resul);
}

module.exports = initializer;
