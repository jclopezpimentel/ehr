var initializer = {};

initializer.searchFunctionAndSmartContract = function(functionName){	
    switch(functionName) {
        case "createGover": return ["Found","constructor","Entities"];
        default:            return ["NotFound","Error"];
    }

}


module.exports = initializer;