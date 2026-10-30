var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var chain = require('./blockchain');
var hashing = require('./hashing');
var initializer = {};

// POST /addEHR
// body: { functionName: "addHealthRecord", gas, sender, ehrSC, id, title, section, details }
// A healthcare professional (Medicine degree) adds a record to the EHR of a patient.
// The microservice hashes id, title, section and details with SHA-256 before sending them,
// and returns those hashes with the receipt so they can be stored off-chain.
initializer.addEHR = async function (req, res) {
    const [found, functionName, contractABIPath] = listFuncInChain.searchFunctionAndSmartContract(req.body.functionName);
    let resul = {};
    if (found === "NotFound" || functionName !== "addHealthRecord") {
        resul = utilities.toResult("Error", "11", errorControl.errors("11"));
    } else {
        const obj = {
            body: {
                gas: req.body.gas,
                sender: req.body.sender,
                ehrSC: req.body.ehrSC,
                id: req.body.id,
                title: req.body.title,
                section: req.body.section,
                details: req.body.details
            }
        };
        const errNum = errorControl.someFieldIsEmpty(obj);
        if (errNum) {
            resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
        } else {
            const h = hashing.hashRecord(obj.body.id, obj.body.title, obj.body.section, obj.body.details);
            try {
                const receipt = await chain.send(contractABIPath, obj.body.ehrSC, functionName,
                    [h.idH, h.titleH, h.sectionH, h.detailsH], obj.body.sender, obj.body.gas);
                receipt.hashes = h;
                resul = utilities.toResult("Ok", "0", receipt);
            } catch (error) {
                resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
            }
        }
    }
    res.send(resul);
}

module.exports = initializer;
