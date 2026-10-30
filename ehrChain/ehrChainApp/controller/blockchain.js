// Shared access to the blockchain for every EHRChain controller.
// Same steps as the entities controllers: check the node is alive, open web3,
// run the operation, close the connection. Errors are thrown as the codes in errors.js:
//   "9"  -> the blockchain node is not reachable
//   "10" -> the smart contract rejected the operation (require, modifier, revert)
var utilities = require('./utilities');
var initializer = {};

async function openWeb3() {
    const ws = await utilities.connectToServer();
    if (ws.Result === "Error") {
        throw new Error("9");
    }
    const { Web3 } = require('web3');
    return new Web3(Web3.givenProvider || blockchainAddress);
}

// Deploys a contract and returns the receipt (it contains contractAddress)
initializer.deploy = async function (abiPath, bytecodePath, args, from, gas) {
    const web3 = await openWeb3();
    try {
        const contract = new web3.eth.Contract(utilities.getContainFileJSON(abiPath));
        let receipt = null;
        await contract.deploy({ data: utilities.getContainFile(bytecodePath), arguments: args })
            .send({ from: from, gas: gas, gasPrice: "20000000000" })
            .on('receipt', function (r) { receipt = r; }); // same as createController in entities
        return JSON.parse(JSON.stringify(receipt, utilities.replacer));
    } catch (error) {
        console.log("Error deploy: " + error);
        throw new Error("10");
    } finally {
        web3.currentProvider.disconnect(); //after a request the connection must be closed
    }
}

// Sends a transaction (it changes the blockchain) and returns the receipt
initializer.send = async function (abiPath, contractAdd, functionName, args, from, gas) {
    const web3 = await openWeb3();
    try {
        const contract = new web3.eth.Contract(utilities.getContainFileJSON(abiPath), contractAdd);
        const receipt = await contract.methods[functionName](...args).send({ from: from, gas: gas });
        return JSON.parse(JSON.stringify(receipt, utilities.replacer));
    } catch (error) {
        console.log("Error send " + functionName + ": " + error);
        throw new Error("10");
    } finally {
        web3.currentProvider.disconnect();
    }
}

// Reads a value (it does not change the blockchain). "from" is required by
// methods protected with modifiers such as ownerOrGovernment.
initializer.call = async function (abiPath, contractAdd, functionName, args, from, gas) {
    const web3 = await openWeb3();
    try {
        const contract = new web3.eth.Contract(utilities.getContainFileJSON(abiPath), contractAdd);
        const options = {};
        if (from) options.from = from;
        if (gas) options.gas = gas;
        const result = await contract.methods[functionName](...args).call(options);
        return JSON.parse(JSON.stringify(result, utilities.replacer));
    } catch (error) {
        console.log("Error call " + functionName + ": " + error);
        throw new Error("10");
    } finally {
        web3.currentProvider.disconnect();
    }
}

module.exports = initializer;
