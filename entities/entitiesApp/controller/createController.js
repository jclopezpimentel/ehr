var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var initializer = {};

async function executeConstructor(gas, from, contractABI, contractByteCodeObj) {
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
			const contract = await userContract.deploy({ data: contractByteCodeObj });
			await contract.send( //gasLimit must be set to 6721975, otherwise it will not work
				{ from: from, gas: gas, gasPrice: "20000000000", nonce: nonce }).on('receipt', function (receipt) {
					console.log("Entró4: " + from);
//					from = from.toUpperCase();
//					const fromRet = receipt.from.toUpperCase();
//					console.log("Entró5: " + from);
					y = JSON.parse(JSON.stringify(receipt, utilities.replacer));	
/*					if (from.toUpperCase() === fromRet) {
						y = {
							"transactionHash": receipt.transactionHash.toString(),
							"contractAddress": receipt.contractAddress.toString(),
							"gasUsed": receipt.gasUsed.toString(),
							"blockNumber": receipt.blockNumber.toString(),
							"blockHash": receipt.blockHash.toString(),
							"from": fromRet.toString(),
							"fromorigin": from.toString()
						};
						
					} else {
						y = {
							"transactionHash": receipt.transactionHash.toString(),
							"contractAddress": receipt.contractAddress.toString(),
							"gasUsed": receipt.gasUsed.toString(),
							"blockNumber": receipt.blockNumber.toString(),
							"blockHash": receipt.blockHash.toString(),
							"from": fromRet.toString(),
							"fromorigin": from.toString()
						};
						
						//console.log("ErrRare: from:" + from + "\n" + "fromRet:" + fromRet + "\n" + "nonce:" + nonce );
						console.log("ErrRare: from:" + from + "\n" + "fromRet:" + fromRet);
					}*/
				}).on("error", function (error) {
					console.log("Error: " + error + "\n from: " + from);
					y = { //antes tenía resul
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

async function createSC(obj) {
	const gas = obj.body.gas;
	const from = obj.body.from;
	const functionName = obj.body.functionName;
	const contractABI = utilities.getContainFileJSON(obj.body.contractABIPath);
	const contractByteCodeObj = utilities.getContainFile(obj.body.contractByteCodeSource);
	//contractABI = utilities.getContainFileJSON(contractABIPath);	
	//contractByteCodeObj = utilities.getContainFile(contractByteCodeSource);
	console.log("FunctionName: " + functionName + "\nFrom: " + from + "\nGas: " + gas);
	let resul = {};
	if(functionName === "constructor"){	
		//resul = utilities.toResult("false", "0", "Testing:all ok");  // it is false when there is no error
		try {
			const result = await executeConstructor(gas, from, contractABI, contractByteCodeObj);
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


initializer.create = async function (req, res) {
	const funName = req.body.functionName;
	const [found, functionName,contractABIPath,contractByteCodeSource] = listFuncInChain.searchFunctionAndSmartContract(funName);
	let resul = {};
	if(found === "NotFound"){
		errNNum = "11";
		resul = utilities.toResult("Error", errNNum, errorControl.errors(errNNum));// it is false when there is no error
	}else{
		const gas = req.body.gas;
		const from = req.body.from;
		console.log("Request from: " + from);
		//It is required that all variables contain any value (not empty)
		const obj = {
			body:
			{
				functionName: functionName,
				contractABIPath: contractABIPath,
				contractByteCodeSource: contractByteCodeSource,
				gas: gas,
				from: from
			}
		};
		const errNum = errorControl.someFieldIsEmpty(obj);
		if (errNum) {  //				
			resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
		} else {
			console.log("Processing request from: " + from);
			resul = await createSC(obj);
		}

	}
	res.send(resul);
}

module.exports = initializer;