var errorControl = require('./errors');
var utilities = require('./utilities');
var consultP = require('./consultPController');
var listFuncInChain = require('./listFunctionsInBlockchain');
var initializer = {};

// Calls every method listed in the "getInfoDI" case of listFunctionsInBlockchain
async function callingGetInfoDI(obj) {
    const contractAdd = obj.body.contractAdd;
    const functionNames = obj.body.functionNames;
    const contractABI = utilities.getContainFileJSON(obj.body.contractABIPath);
    const gas = obj.body.gas;
    const sender = obj.body.sender;
    const address = obj.body.address;
    let result = {};
    for (let method of functionNames) {
        const response = await consultP.executeConsult(method, contractAdd, contractABI, gas, sender, address);
        if (response.Result === "Error") {
            console.log(`Error calling ${method}: while processing the request`);
            return utilities.toResult("Error", "13", errorControl.errors(13));
        }
        result[method] = response;
    }
    return utilities.toResult("Ok", "0", result);
}

// GET /getInfoDI?digitalId=<DigitalIdentity>&sender=<account>&gas=<gas>&address=<linked contract>
initializer.getInfoDI = async function (req, res) {
    const funName = "getInfoDI";
    const [found, functionNames,contractABIPath,contractByteCodeSource] = listFuncInChain.searchFunctionAndSmartContract(funName);
    let resul = {};
    if(found === "NotFound"){
        const errNNum = "11";
        resul = utilities.toResult("Error", errNNum, errorControl.errors(errNNum));
    }else{
        const obj = {
            body:
            {
                functionNames: functionNames,
                contractABIPath: contractABIPath,
                contractByteCodeSource: contractByteCodeSource,
                contractAdd: req.query.digitalId,
                gas: req.query.gas,
                sender: req.query.sender,
                address: req.query.address
            }
        };
        const errNum = errorControl.someFieldIsEmpty(obj);
        if (errNum) {
            resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
        } else {
            resul = await callingGetInfoDI(obj);
        }
    }
    res.send(resul);
};

module.exports = initializer;
