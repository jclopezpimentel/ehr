var initializer = {};

initializer.searchFunctionAndSmartContract = function(functionName){	
    switch(functionName) {
        case "createGover": return ["Found","constructor","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "registerEntity": return ["Found","registerEntity","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "ownerEntity": return ["Found","owner","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "typeContractEntity": return ["Found","typeContract","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "governmentEntity": return ["Found","government","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "dateCreationEntity": return ["Found","dateCreation","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "dateLastUpdateEntity": return ["Found","dateLastUpdate","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "getTypeEntityP": return ["Found","getType","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "getCreatorEntityP": return ["Found","getCreator","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "entityExistsEntityP": return ["Found","entityExists","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "getDigIdentityAddEntityP": return ["Found","getDigIdentityAdd","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "getInfoEntity": return ["Found",["getType", "getDigIdentityAdd", "getCreator"],"./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "linkContract": return ["Found","linkContract","./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];        
        default:            return ["NotFound","Error"];
    }

}

module.exports = initializer;

//global.contractABIPath = "./smartContract/Entities.abi";
//global.contractByteCodeSource = "./smartContract/Entities.bytecode";
