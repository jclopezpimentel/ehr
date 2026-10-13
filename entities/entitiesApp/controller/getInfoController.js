var errorControl = require('./errors');
var utilities = require('./utilities');
var consultP = require('./consultPController');
var listFuncInChain = require('./listFunctionsInBlockchain');
var initializer = {};

// Function to serialize BigInt values in an object
function serializeBigInt(obj) {
    return JSON.parse(
        JSON.stringify(obj, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}


async function callingGetInfo(req) {
    const contractAdd = req.body.contractAdd; 
    const functionNames = req.body.functionNames;
    const contractABI = utilities.getContainFileJSON(req.body.contractABIPath);
    const gas = req.body.gas;
    const sender = req.body.sender;
    const address = req.body.address;    
    let result = {};
    let hayError = false;
        // Call each getter method
    for (let method of functionNames) {
            const response = await consultP.executeConsult(method, contractAdd, contractABI,gas, sender,address); 
            result[method] = response;
            if(response.Result === "Error"){
                console.log(`Error calling ${method}: while processing the request`);
                result[method] = `Error: ${error.message}`;
                hayError = true;
                break; // Exit the loop on first error
            }
            console.log(`Response from ${method}:`, response);
    }
    if (hayError) {
        resul = utilities.toResult("Error", 13, errorControl.errors(13));
    } else {
        //resul = utilities.toResult("Ok", "0", serializeBigInt(result));
        resul = utilities.toResult("Ok", "0", result);
    }
    return resul;
}

initializer.getInfo = async function (req, res) {
    const funName = "getInfoEntity"; //public method or attribute	
    const [found, functionNames,contractABIPath,contractByteCodeSource] = listFuncInChain.searchFunctionAndSmartContract(funName);
    if(found === "NotFound"){
        errNNum = "11";
        resul = utilities.toResult("Error", errNNum, errorControl.errors(errNNum));// it is false when there is no error
    }else{
        const entityAdd = req.query.entityAdd;
        const gas = req.query.gas;	
        const sender = req.query.sender;
        const address = req.query.address;
        const obj = {
            body:
            {
                functionNames: functionNames,
                contractABIPath: contractABIPath,
                contractByteCodeSource: contractByteCodeSource,
                contractAdd:entityAdd,
                gas:gas,
                sender:sender,
                address:address
            }
        };
        const errNum = errorControl.someFieldIsEmpty(obj);
        if (errNum) {  //				
            resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
        } else {
            resul = await callingGetInfo(obj);
            console.log("Result from getInfo: ", resul);
        }

    }
    res.send(resul);
};

module.exports = initializer;
