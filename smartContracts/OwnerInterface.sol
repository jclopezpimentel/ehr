// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

//Within the ecosystem this interface is the base of all smart contracts
interface OwnerInterface {
    
    //Each smart contract name in the ecosystem must be included within this enum
    enum ContractName {
        Entities,        
        DigitalIdentity,
        BirthCertificate,
        GralEHR,
        EHR,
        AcademicsDegree
    }

    function owner() external view returns (address);
    function nameContract() external view returns (ContractName); 
    function government() external view returns (address); //the creator of the smart contract
    function dateCreation() external view returns (uint); //date when was created the smart contract
}