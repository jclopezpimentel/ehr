var initializer = {};

initializer.searchFunctionAndSmartContract = function(functionName){	
    switch(functionName) {
        case "create": return ["Found","constructor","./smartContract/BirthCertificate.abi","./smartContract/BirthCertificate.bytecode"];
        default:            return ["NotFound","Error","Error"];
    }

}

module.exports = initializer;
