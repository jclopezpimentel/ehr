var initializer = {};

initializer.searchFunctionAndSmartContract = function(functionName){	
    switch(functionName) {
        case "createGover": return ["Found","constructor","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "registerEntity": return ["Found","registerEntity","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "ownerEntity": return ["Found","owner","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "nameContractEntity": return ["Found","nameContract","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "governmentEntity": return ["Found","government","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "dateCreationEntity": return ["Found","dateCreation","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "dateLastUpdateEntity": return ["Found","dateLastUpdate","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "getTypeEntityP": return ["Found","getType","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "getCreatorEntityP": return ["Found","getCreator","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "entityExistsEntityP": return ["Found","entityExists","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "getDigIdentityAddEntityP": return ["Found","getDigIdentityAdd","./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "getInfoEntity": return ["Found",["getType", "getDigIdentityAdd", "getCreator"],"./smartContract/Entities.abi","./smartContract/Entities.bytecode"];
        case "linkContract": return ["Found","linkContract","./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];
        // DigitalIdentity: public attributes / methods without params (GET /consultDI)
        case "ownerDI": return ["Found","owner","./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];
        case "governmentDI": return ["Found","government","./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];
        case "nameContractDI": return ["Found","nameContract","./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];
        case "addOfEntitiesDI": return ["Found","addOfEntities","./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];
        case "dateCreationDI": return ["Found","dateCreation","./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];
        case "dateLastUpdateDI": return ["Found","dateLastUpdate","./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];
        case "numberOfLinkedContractsDI": return ["Found","numberOfLinkedContracts","./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];
        // DigitalIdentity: methods that receive the address of a linked contract (GET /consultDIP)
        case "getContractNameDIP": return ["Found","getContractName","./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];
        case "creatorIsGovernmentDIP": return ["Found","creatorIsGovernment","./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];
        case "getCreatorOfContractDIP": return ["Found","getCreatorOfContract","./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];
        // DigitalIdentity: the three DIP methods together (GET /getInfoDI)
        case "getInfoDI": return ["Found",["getContractName", "creatorIsGovernment", "getCreatorOfContract"],"./smartContract/DigitalIdentity.abi","./smartContract/DigitalIdentity.bytecode"];
        default:            return ["NotFound","Error","Error"];
    }

}

module.exports = initializer;
