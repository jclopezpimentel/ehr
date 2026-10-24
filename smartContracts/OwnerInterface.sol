// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface OwnerInterface {
    enum ContractType {
        Entities,        
        DigitalIdentity,
        BirthCertificate,
        GralEHR,
        EHR,
        AcademicsDegree
    }

    function owner() external view returns (address);
    function typeContract() external view returns (ContractType); 
    function government() external view returns (address);
}