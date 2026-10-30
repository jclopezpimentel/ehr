var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var consultController = require('./consultController');
var initializer = {};

// GET /consultDI?digitalId=<DigitalIdentity address>&publicMethod=<method>
// Public attributes / methods of DigitalIdentity without params:
// owner, government, nameContract, addOfEntities, dateCreation, dateLastUpdate, numberOfLinkedContracts
initializer.consultDI = async function (req, res){
	const funName = req.query.publicMethod + "DI"; //alias in listFunctionsInBlockchain
	const [found, functionName,contractABIPath,contractByteCodeSource] = listFuncInChain.searchFunctionAndSmartContract(funName);
	let resul = {};
	if(found === "NotFound"){
		const errNNum = "11";
		resul = utilities.toResult("Error", errNNum, errorControl.errors(errNNum));
	}else{
		const digitalId = req.query.digitalId;
		const obj = {
			body:
			{
				functionName: functionName,
				contractABIPath: contractABIPath,
				contractByteCodeSource: contractByteCodeSource,
				contractAdd: digitalId
			}
		};
		const errNum = errorControl.someFieldIsEmpty(obj);
		if (errNum) {
			resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
		} else {
			resul = await consultController.callIdenSC(obj);
		}
	}
	res.send(resul);
}

module.exports = initializer;
