var initializer = {};

// Translates the name the client sends into the real function of the smart contract
// and the ABI/bytecode to use. Names follow Table 8 (EHRChain) of the paper.
initializer.searchFunctionAndSmartContract = function(functionName){
    switch(functionName) {
        // POST /createGralEHRChain  (functionName: createGralEHR)
        case "createGralEHR": return ["Found","constructor","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        // POST /createEHRChain  (functionName: createEHR)
        case "createEHR": return ["Found","createEHR","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        // GET /consultGralEHRChain  (<functionName>: methods of OwnerInterface)
        case "ownerGralEHRChain": return ["Found","owner","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        case "governmentGralEHRChain": return ["Found","government","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        case "nameContractGralEHRChain": return ["Found","nameContract","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        case "dateCreationGralEHRChain": return ["Found","dateCreation","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        case "dateLastUpdateGralEHRChain": return ["Found","dateLastUpdate","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        // GET /consultGralEHRChain_P  (<functionNameP>: getters of GralEHR that receive a CURP)
        case "getEHR_SCGralEHRChain_P": return ["Found","getEHR_SC","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        case "getWhoCreatedEHRGralEHRChain_P": return ["Found","getWhoCreatedEHR","./smartContract/GralEHR.abi","./smartContract/GralEHR.bytecode"];
        // POST /addEHRChain  (functionName: addHealthRecord)
        case "addHealthRecord": return ["Found","addHealthRecord","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        // GET /checkIntegrityEHRChain  (functionName: cEHRIntegrity)
        // The paper names the contract function checkRecordIntegrity; in EHR.sol it is checkEHRIntegrity.
        case "cEHRIntegrity": return ["Found","checkEHRIntegrity","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        // GET /consultEHRChain  (<functionName>: methods of OwnerInterface plus getBirthCertificate)
        case "ownerEHRChain": return ["Found","owner","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        case "governmentEHRChain": return ["Found","government","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        case "nameContractEHRChain": return ["Found","nameContract","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        case "dateCreationEHRChain": return ["Found","dateCreation","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        case "dateLastUpdateEHRChain": return ["Found","dateLastUpdate","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        case "getBirthCertificateEHRChain": return ["Found","getBirthCertificate","./smartContract/EHR.abi","./smartContract/EHR.bytecode"];
        default:            return ["NotFound","Error","Error"];
    }
}

module.exports = initializer;
