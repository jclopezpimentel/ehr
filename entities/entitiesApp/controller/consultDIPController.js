var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var consultPController = require('./consultPController');
var initializer = {};

// GET /consultDIP?digitalId=<DigitalIdentity>&publicMethod=<method>&sender=<account>&gas=<gas>&address=<linked contract>
// Methods of DigitalIdentity that receive the address of a linked contract:
// getContractName, creatorIsGovernment, getCreatorOfContract
initializer.consultDIP = async function (req, res){
    const funName = req.query.publicMethod + "DIP"; //alias in listFunctionsInBlockchain
    const [found, functionName,contractABIPath,contractByteCodeSource] = listFuncInChain.searchFunctionAndSmartContract(funName);
    let resul = {};
    if(found === "NotFound"){
        const errNNum = "11";
        resul = utilities.toResult("Error", errNNum, errorControl.errors(errNNum));
    }else{
        const obj = {
            body:
            {
                functionName: functionName,
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
            resul = await consultPController.callPSC(obj);
        }
    }
    res.send(resul);
}

module.exports = initializer;
