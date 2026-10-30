var initializer = {};

// Translates the name the client sends (functionName or publicMethod + suffix)
// into the real function of the smart contract and the ABI/bytecode to use.
initializer.searchFunctionAndSmartContract = function(functionName){
    switch(functionName) {
        // GralEHR: deploy (POST /createGralEHR) and create an EHR (POST /createEHR)
        case "createGralEHR": return ["Found","constructor","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        case "createEHR": return ["Found","createEHR","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        // GralEHR: public attributes without params (GET /consultGralEHR)
        case "ownerGralEHR": return ["Found","owner","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        case "governmentGralEHR": return ["Found","government","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        case "nameContractGralEHR": return ["Found","nameContract","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        case "dateCreationGralEHR": return ["Found","dateCreation","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        case "dateLastUpdateGralEHR": return ["Found","dateLastUpdate","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        // GralEHR: methods that receive a CURP; only the owner or the government (GET /consultGralEHRP)
        case "getEHR_SCGralEHRP": return ["Found","getEHR_SC","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        case "getWhoCreatedEHRGralEHRP": return ["Found","getWhoCreatedEHR","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        // EHR: add a health record (POST /addEHR) and check its integrity (GET /checkEHR)
        case "addHealthRecord": return ["Found","addHealthRecord","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        case "checkEHRIntegrity": return ["Found","checkEHRIntegrity","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        // EHR: public attributes / methods without params (GET /consultEHR)
        case "ownerEHR": return ["Found","owner","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        case "governmentEHR": return ["Found","government","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        case "nameContractEHR": return ["Found","nameContract","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        case "dateCreationEHR": return ["Found","dateCreation","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        case "dateLastUpdateEHR": return ["Found","dateLastUpdate","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        case "getBirthCertificateEHR": return ["Found","getBirthCertificate","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        default:            return ["NotFound","Error","Error"];
    }
}

module.exports = initializer;
