var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var chain = require('./blockchain');
var initializer = {};

// POST /createGralEHR
// body: { functionName: "createGralEHR", gas, government, entitySC, academicDegSC }
// The government deploys the single GralEHR of the system: constructor(entitySC, academicDegSC)
initializer.createGralEHR = async function (req, res) {
    const [found, functionName, contractABIPath, contractByteCodeSource] = listFuncInChain.searchFunctionAndSmartContract(req.body.functionName);
    let resul = {};
    if (found === "NotFound" || functionName !== "constructor") {
        resul = utilities.toResult("Error", "11", errorControl.errors("11"));
    } else {
        const obj = {
            body: {
                gas: req.body.gas,
                government: req.body.government,
                entitySC: req.body.entitySC,
                academicDegSC: req.body.academicDegSC
            }
        };
        const errNum = errorControl.someFieldIsEmpty(obj);
        if (errNum) {
            resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
        } else {
            try {
                const receipt = await chain.deploy(contractABIPath, contractByteCodeSource,
                    [obj.body.entitySC, obj.body.academicDegSC], obj.body.government, obj.body.gas);
                resul = utilities.toResult("Ok", "0", receipt);
            } catch (error) {
                resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
            }
        }
    }
    res.send(resul);
}

module.exports = initializer;
