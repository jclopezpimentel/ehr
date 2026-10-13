var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var initializer = {};
/*
//need to be modified
async function consultMethodNotParamsUsersSC(req){
	//console.log("OK");
	contractABI = utilities.getContainFile(contractABIPath);	//contractABIPath is a global variable
	contractByteCode = utilities.getContainFile(contractByteCodePath); //contractByteCodePath  is a global variable
	contractByteCodeObj = contractByteCode.object;
    const contractAdd = req.body.contractAdd; 
    const publicMethod = req.body.publicMethod; 	
	const tokenId = req.body.tokenId;	
	var y="";
	try {
		const { Web3 } = require('web3');
		const ws = await utilities.connectToServer();
		if(ws.Result==="Error") {
			throw new Error("9");			
		}else{
			console.log("Node is alive");
		}
		
		await new Promise(async (resolve,reject) => {
			try {
				console.log("Entré promise");
				const web3 = new Web3(Web3.givenProvider || blockchainAddress);
				const userContract = new web3.eth.Contract(contractABI,contractAdd);
				const contractAnswer = await userContract.methods[publicMethod](tokenId).call().then(function(result) {				
					//console.log(result);				
					resWB = {
						Result: "Success",					
						Value: result
					};
					y = JSON.parse(JSON.stringify(resWB, utilities.replacer));
					//fn(resHE);
				  }).catch((error)=>{
					errNum = "7"; 
					y = {
						Result: "Error",
						Num: errNum,
						Description : errorControl.errors(errNum) + " " + error
					}		
					console.log("Error8:" + error);
				  });
				web3.currentProvider.disconnect(); //after a request the connection must be closed
				resolve(y);
			}catch (error) {
                    resul = {
                        Result: "Error",                        
                        from:"0x0000000",
						Num : "11",
                        Description : error.message
                    }           
                    //console.log("Error6");
                    reject(resul);									
			}
			}).then((result) => {			
				y = result;
		  	})
		  	.catch((error) => {
				console.log("Error5 ownerof");
				y = error;
		  	});
		return y;
	}catch (e) {
		console.log("Error4");
		throw new Error(e.message);
	}
}

//need to be modified
initializer.consultMethodWithParams = async function (req, res){
	//var gas = req.body.gas;	
    const contractAdd = req.body.contractAdd;	
	const publicMethod = "getNameToken";
	const tokenId = req.body.tokenId;
	//var from = req.body.from;
	var resul = {Result: "Success"};
	var obj={body:
			{	//gas:gas,
                contractAdd:contractAdd,
                publicMethod: publicMethod,
				tokenAdd : tokenAdd
			}};
	const errNum = errorControl.someFieldIsEmpty(obj);
	if(errNum){  //				
			resul = {
				Result: "Error",
				Num: errNum.toString(),
				Description : errorControl.errors(errNum)
			}	
			console.log("Error en ConsultInfo");	
			res.send(resul);
	}else{
			try {
				const response = await consultMethodNotParamsUsersSC(obj).then((resul)=>{
					//let resHE = errorControl.handlingErrorOrNot(resul,manufacturerAdd);
					let resHE = JSON.parse(JSON.stringify(resul, utilities.replacer));					
					return resHE;
				}).catch((e)=>{
					console.log("Error0");
					y = {Result:e.message};
					return y;
				});
				if(response.Result==="9"){
					console.log("Error1");
					throw new Error("9");
				}else{
					res.send(response);
				}				
			} catch (error) {
				console.log("Error2"+ error.message);
				y = errorControl.connectionError(error.message,"0x0000000000");
				res.send(y); 
			}
	}
}

*/

async function executeConsult(functionName, contractAdd, contractABI){
	let y = "";
	try {
		const { Web3 } = require('web3');
		console.log("Entró1: ");
		const ws = await utilities.connectToServer();
		if (ws.Result === "Error") {
			throw new Error("9");
		} else {
			console.log("Node is alive");
		}
		console.log("Entró2: ");
		try {
			const web3 = new Web3(Web3.givenProvider || blockchainAddress);
			const userContract = new web3.eth.Contract(contractABI,contractAdd);                			
			console.log("Entró3: ");
			//const contractAnswer = await userContract.methods.typeContract().call().then(function(result) {				                				
			const contractAnswer = await userContract.methods[functionName]().call().then(function(result) {				                				
					console.log(result);									
					y = JSON.parse(JSON.stringify(result, utilities.replacer));	
					console.log("y: " + y);				
				  }).catch((error)=>{
					console.log("ErrorI:" + error);
					throw new Error("0");	
				  });
			web3.currentProvider.disconnect(); //after a request the connection must be closed
			return y;
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

//modified
async function callIdenSC(req){
    const contractAdd = req.body.contractAdd; 
	const functionName = req.body.functionName;
	const contractABI = utilities.getContainFileJSON(req.body.contractABIPath);
	
	try {
		const result = await executeConsult(functionName, contractAdd, contractABI);
		resul = utilities.toResult("Ok", "0", result);
		return resul;
	} catch (error) {
		console.error("Error executing SC:", error.message);
		resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
		return resul;
	}

}



//modified
initializer.consultNotParams = async function (req, res){	
    const funName = req.query.publicMethod + "Entity"; //public method or attribute	
	const [found, functionName,contractABIPath,contractByteCodeSource] = listFuncInChain.searchFunctionAndSmartContract(funName);
	let resul = {};
	if(found === "NotFound"){
		errNNum = "11";
		resul = utilities.toResult("Error", errNNum, errorControl.errors(errNNum));// it is false when there is no error
	}else{
		//resul = utilities.toResult("false", 0, "Everything is fine");
		const entityAdd = req.query.entityAdd;	
		const obj = {
			body:
			{
				functionName: functionName,
				contractABIPath: contractABIPath,
				contractByteCodeSource: contractByteCodeSource,
                contractAdd:entityAdd
			}
		};
		const errNum = errorControl.someFieldIsEmpty(obj);
		if (errNum) {  //				
			resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
		} else {
			resul = await callIdenSC(obj);
		}

	}
	res.send(resul);
}


module.exports = initializer;
