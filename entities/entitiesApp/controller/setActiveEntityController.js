var errorControl = require('./errors');
var utilities = require('./utilities');
var listFuncInChain = require('./listFunctionsInBlockchain');
var initializer = {};

// Sends the transaction setActiveOrInactiveAdd(address, active) to the Entities contract.
// The contract only accepts it from an ACTIVE government or admin.
async function executeSetActiveInSC(contractABI, functionName, government, entityAddSC, entityAddress, active, gas) {
    try {
        const { Web3 } = require('web3');
        const ws = await utilities.connectToServer();
        if (ws.Result === "Error") {
            throw new Error("9");
        }
        const web3 = new Web3(Web3.givenProvider || blockchainAddress);
        try {
            const entitiesContract = new web3.eth.Contract(contractABI, entityAddSC);
            const receipt = await entitiesContract.methods[functionName](entityAddress, active).send(
                { from: government, gas: gas });
            return JSON.parse(JSON.stringify(receipt, utilities.replacer));
        } catch (error) {
            console.log("Error setActiveOrInactiveAdd: " + error);
            throw new Error("10");
        } finally {
            web3.currentProvider.disconnect(); //after a request the connection must be closed
        }
    } catch (e) {
        throw new Error(e.message);
    }
}

// "active" arrives as JSON boolean (true/false) or as text ("true"/"false").
// It returns true/false, or null when it is anything else.
function parseActive(value) {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
    return null;
}

// POST /setActiveEntity
// body: { functionName: "setActiveOrInactiveAdd", gas, government, entitySC, address, active }
initializer.setActiveEntity = async function (req, res) {
    const [found, functionName, contractABIPath] = listFuncInChain.searchFunctionAndSmartContract(req.body.functionName);
    let resul = {};
    if (found === "NotFound" || functionName !== "setActiveOrInactiveAdd") {
        resul = utilities.toResult("Error", "11", errorControl.errors("11"));
    } else {
        const obj = {
            body: {
                gas: req.body.gas,
                government: req.body.government,
                entityAddSC: req.body.entitySC,
                entityAddress: req.body.address
            }
        };
        // "active" is checked apart: someFieldIsEmpty uses ==, and in JavaScript false == "" is true,
        // so a valid false would be taken as an empty field.
        const active = parseActive(req.body.active);
        const errNum = errorControl.someFieldIsEmpty(obj) || (active === null ? 1 : 0);
        if (errNum) {
            resul = utilities.toResult("Error", errNum.toString(), errorControl.errors(errNum));
        } else {
            try {
                const contractABI = utilities.getContainFileJSON(contractABIPath);
                const result = await executeSetActiveInSC(contractABI, functionName, obj.body.government,
                    obj.body.entityAddSC, obj.body.entityAddress, active, obj.body.gas);
                resul = utilities.toResult("Ok", "0", result);
            } catch (error) {
                resul = utilities.toResult("Error", error.message, errorControl.errors(error.message));
            }
        }
    }
    res.send(resul);
}

module.exports = initializer;
