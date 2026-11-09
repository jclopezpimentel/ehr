// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./EHR.sol";
import "./BirthCertificate.sol";
import "./EntitiesInterface.sol";
import "./AcademicsDegree.sol";

// This contract is focused to manage the creation of individual Electronic Health Records
contract GralEHR is OwnerInterface{
     //attributes
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public government; 
   address public owner;
   ContractName public nameContract=ContractName.GralEHR;
   address private entitySC;
   address private academicsDegree;

    struct GralEHR_Match{
        address ehr; // address of the EHR contract
        address birthCerSC; // address of the BirthCertificate contract
        address healthCP; // address of the healthcare professional
    }
    //We set the curp and it returns the digitalId and birthCer addresses.        
    mapping(string => GralEHR_Match) private curpMatches;
    

    modifier onlyActiveGovernmentOrAdmin(address _entitySC){
      EntitiesInterface contractEntities = EntitiesInterface(_entitySC);    
      require(contractEntities.getType(msg.sender)==EntitiesInterface.EntityType.Government || 
        contractEntities.getType(msg.sender)==EntitiesInterface.EntityType.Admin,"Only government or admin can perform this action.");
      require(contractEntities.isActive(msg.sender),"Only ACTIVE government or admin can perform this action.");
      _;
    }

  
  constructor(address _entitySC,address _academicsDeg) onlyActiveGovernmentOrAdmin(_entitySC) {
    academicsDegree = _academicsDeg;
    entitySC = _entitySC;
    dateCreation = block.timestamp;
    dateLastUpdate = dateCreation;
    government = msg.sender;
    owner = msg.sender;
  }


    modifier mustBeActiveHealthCP(string memory _idDegree){ // must be healthCare Professional  
      AcademicsDegree academicDegSC = AcademicsDegree(academicsDegree);
      require(academicDegSC.isActive(_idDegree),"The introduced degree is not active");
      require(academicDegSC.whatTypeDegree(_idDegree)==AcademicsDegree.TypeDegree.Medicine,"Incorrect HealthCare Professional user");
      _;
    }

    //This function creates Electronic Health Records (EHR) for entities
    //An entity can have an only one EHR.
    function createEHR(address _birthCerSC, string memory _curp, string memory _idDegree) 
     public mustBeActiveHealthCP(_idDegree) {
      BirthCertificate bc = BirthCertificate(_birthCerSC);
      address digitalId = bc.digitalIdentity();
      require(digitalId!= address(0), "Incorrect digital identity address or birthcertificate address");
      require(bc.verifyCURP(_curp),"CURP does not corresponds to BirthCertificate");
      require(curpMatches[_curp].birthCerSC==address(0),"Curp already exists");
      EHR ehrAdd = new EHR(_curp,address(this),_birthCerSC,msg.sender,academicsDegree);
      curpMatches[_curp] = GralEHR_Match(address(ehrAdd),_birthCerSC, msg.sender);
    }

    modifier GovernmentOrAdmin(string memory _curp){      
      EntitiesInterface contractEntities = EntitiesInterface(entitySC);      
      BirthCertificate bC = BirthCertificate(curpMatches[_curp].birthCerSC);
      require((msg.sender==bC.owner()) || (contractEntities.getType(msg.sender)==EntitiesInterface.EntityType.Government)
            || (contractEntities.getType(msg.sender)==EntitiesInterface.EntityType.Admin),"Owner, Governments or Admins can execute this method");
      _;
    }

    function getEHR_SC(string memory curp) public view GovernmentOrAdmin(curp) returns (address) {
      return curpMatches[curp].ehr; //if it does not exist returns address(0)
    }

    function getWhoCreatedEHR(string memory curp) public view GovernmentOrAdmin(curp) returns (address) {
      return curpMatches[curp].healthCP; //if it does not exist returns address(0)
    }

}