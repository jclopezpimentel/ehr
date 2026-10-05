var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var initializer = {};

async function executeRegisterEntityInSC(contractABI, functionName, government, entityAddSC, entityAddress, entityType, gas) {
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
            const userContract = new web3.eth.Contract(contractABI,entityAddSC);                			
            console.log("Entró3: ");
            //const contractAnswer = await userContract.methods.typeContract().call().then(function(result) {				                				
            const contractAnswer = await userContract.methods[functionName](entityAddress,entityType).send(
                { from: government, gas: gas }
                ).on('receipt', function(result) {
                    console.log(result);									
                    y = JSON.parse(JSON.stringify(result, utilities.replacer));	
                    console.log("y: " + y);				
                    })
                .on('error', function(error) {
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


async function registerEntityInSC(obj) {
    const contractABI = utilities.getContainFileJSON(obj.body.contractABIPath);
    //const contractByteCodeObj = utilities.getContainFile(obj.body.contractByteCodeSource);
    const functionName          = obj.body.functionName;
    const gas                   = obj.body.gas;
    const entityAddSC           = obj.body.entityAddSC;
    const entityAddress         = obj.body.entityAddress;
    const entityType            = obj.body.entityType;
    const government            = obj.body.government;

    try {
        const result = await executeRegisterEntityInSC(contractABI, functionName, government, entityAddSC, entityAddress, entityType, gas);
        resul = utilities.toResult("Ok", "0", result);
        console.log("Result from SC: " + JSON.stringify(result));
        return resul;
    } catch (error) {
        console.error("Error executing SC:", error.message);
        resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
        console.log("Result from SC: " + JSON.stringify(resul));
        return resul;
    }
}



// Public function to register entity
initializer.registerEntity = async function(req, res) {
    console.log("Received: " + JSON.stringify(req.body));
    const funName = req.body.functionName;
    const [found, functionName,contractABIPath,contractByteCodeSource] = listFuncInChain.searchFunctionAndSmartContract(funName);
    let resul = {};
    if(found === "NotFound"){
        errNNum = "11";
        resul = utilities.toResult("Error", errNNum, errorControl.errors(errNNum));// it is false when there is no error
    }else{
        const gas = req.body.gas;
        const entityAdd = req.body.entityAdd;    
        const address = req.body.address;
        const entityType = req.body.entityType;
        const government = req.body.government;
        console.log("Request from: " + government);
        //It is required that all variables contain any value (not empty)
        const obj = {
            body:
            {
                functionName: functionName,
                contractABIPath: contractABIPath,
                contractByteCodeSource: contractByteCodeSource,
                gas: gas,
                entityAddSC: entityAdd,
                entityAddress: address,
                entityType: entityType,
                government: government
            }
        };
        const errNum = errorControl.someFieldIsEmpty(obj);
        if (errNum) {  //				
            resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
        } else {
            console.log("Processing request from: " + government);
            resul = await registerEntityInSC(obj);
        }

    }
    res.send(resul);
}

module.exports = initializer;