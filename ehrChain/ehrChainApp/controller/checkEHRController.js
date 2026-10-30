var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var chain = require('./blockchain');
var hashing = require('./hashing');
var initializer = {};

// GET /checkEHR?ehrSC=<address>&id=<id>&title=<title>&section=<section>&details=<details>
// Hashes the four values with SHA-256 and asks the EHR if they match a stored record.
// Returns true only when the record exists and nothing was altered.
initializer.checkEHR = async function (req, res) {
    const [found, functionName, contractABIPath] = listFuncInChain.searchFunctionAndSmartContract("checkEHRIntegrity");
    let resul = {};
    if (found === "NotFound") {
        resul = utilities.toResult("Error", "11", errorControl.errors("11"));
    } else {
        const obj = {
            body: {
                ehrSC: req.query.ehrSC,
                id: req.query.id,
                title: req.query.title,
                section: req.query.section,
                details: req.query.details
            }
        };
        const errNum = errorControl.someFieldIsEmpty(obj);
        if (errNum) {
            resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
        } else {
            const h = hashing.hashRecord(obj.body.id, obj.body.title, obj.body.section, obj.body.details);
            try {
                const value = await chain.call(contractABIPath, obj.body.ehrSC, functionName,
                    [h.idH, h.titleH, h.sectionH, h.detailsH]);
                resul = utilities.toResult("Ok", "0", value);
            } catch (error) {
                resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
            }
        }
    }
    res.send(resul);
}

module.exports = initializer;
