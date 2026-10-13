var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var initializer = {};

async function executeConstructor(gas, from, contractABI, contractByteCodeObj, name, fLastName, mLastName, gender, birthday, state, municipality, locality, country, entities, digitalId) {
	console.log("ExecutingConstructor");
	var y = "";
	try {
		const { Web3 } = require('web3');
		console.log("Entró1: " + from);
		const ws = await utilities.connectToServer();
		if (ws.Result === "Error") {
			throw new Error("9");
		} else {
			console.log("Node is alive");
		}
		console.log("Entró2: " + from);
		try {
			const web3 = new Web3(Web3.givenProvider || blockchainAddress);
			const userContract = new web3.eth.Contract(contractABI);
			console.log("Entró3: " + from);
			const nonce = await web3.eth.getTransactionCount(from);
			const contract = await userContract.deploy({ data: contractByteCodeObj, arguments: [name, fLastName, mLastName, gender, birthday, locality, municipality, state, country, entities, digitalId] });
			await contract.send( //gasLimit must be set to 6721975, otherwise it will not work
				{ from: from, gas: gas, gasPrice: 20000000000, nonce: nonce, gasLimit: 6721975 }).on('receipt', function (receipt) {
					console.log("Entró4: " + from);					
					y = JSON.parse(JSON.stringify(receipt, utilities.replacer));	
					console.log("y: " + JSON.stringify(y));
				}).on("error", function (error) {
					console.log("Error: " + error + "\n from: " + from);
					y = { 
						Result: "Error",
						from: from,
						Num: "11",
						Description: error.message
					}
				});
			console.log("Entró6: " + y);				
			web3.currentProvider.disconnect(); //after a request the connection must be closed
		} catch (error) {
			console.log("Error: from address:" + error);
			throw new Error("10");	
		}
		return y;	
	} catch (e) {
		console.error("Error:", e.message);
		throw new Error(e.message);
	}	
}

async function createBCInSC(obj) {
	const gas = obj.body.gas;
	const from = obj.body.from;
	const functionName = obj.body.functionName;
	const contractABI = utilities.getContainFileJSON(obj.body.contractABIPath);
	const contractByteCodeObj = utilities.getContainFile(obj.body.contractByteCodeSource);
	const name = obj.body.name;
	const fLastName = obj.body.fLastName;
	const mLastName = obj.body.mLastName;
	const gender = obj.body.gender;
	const birthday = obj.body.birthday;
	const state = obj.body.state;
	const municipality = obj.body.municipality;
	const locality = obj.body.locality;
	const country = obj.body.country;
	const entities = obj.body.entities;
	const digitalId = obj.body.digitalId;

	console.log("FunctionName: " + functionName + "\nFrom: " + from + "\nGas: " + gas);
	let resul = {};
	if(functionName === "constructor"){	
		try {
			const result = await executeConstructor(gas, from, contractABI, contractByteCodeObj, name, fLastName, mLastName, gender, birthday, state, municipality, locality, country, entities, digitalId);
			resul = utilities.toResult("Ok", "0", result);
			return resul;
		} catch (error) {
			console.error("Error executing SC:", error.message);
			resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
			return resul;
		}
	} else {
		resul = utilities.toResult("Error", "11", errorControl.errors("11"));		
	}
	console.log(resul);
	return resul;
}

initializer.createBC = async function (req, res) {
	const funName = req.body.functionName;
	const [found, functionName,contractABIPath,contractByteCodeSource] = listFuncInChain.searchFunctionAndSmartContract(funName);
	let resul = {};
	if(found === "NotFound"){
		errNNum = "11";
		resul = utilities.toResult("Error", errNNum, errorControl.errors(errNNum));// it is false when there is no error
	}else{
		const gas = req.body.gas;
		const from = req.body.government;
		const name = req.body.name;
		const fLastName = req.body.fLastName;
		const mLastName = req.body.mLastName;
		const gender = req.body.gender;
		const birthday = req.body.birthday;
		const state = req.body.state;
		const municipality = req.body.municipality;
		const locality = req.body.locality;
		const country = req.body.country;
		const entities = req.body.entities;
		const digitalId = req.body.digitalId;
		//It is required that all variables contain any value (not empty)
		const obj = {
			body:
			{
				functionName: functionName,
				contractABIPath: contractABIPath,
				contractByteCodeSource: contractByteCodeSource,
				gas: gas,
				from: from,
				name: name,
				fLastName: fLastName,
				mLastName: mLastName,
				gender: gender,
				birthday: birthday,
				state: state,
				municipality: municipality,
				locality: locality,
				country: country,
				entities: entities,
				digitalId: digitalId
			}
		};
		//console.log("Request body: " + JSON.stringify(obj.body));
		const errNum = errorControl.someFieldIsEmpty(obj);
		if (errNum) {  //				
			resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
		} else {
			console.log("Processing request from: " + from);
			resul = await createBCInSC(obj);
		}

	}
	res.send(resul);
}


module.exports = initializer;