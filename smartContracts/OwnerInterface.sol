// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface OwnerInterface {
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
    function government() external view returns (address);
    function dateCreation() external view returns (uint);
}