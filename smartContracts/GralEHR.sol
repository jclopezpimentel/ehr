// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./EHR.sol";
import "./BirthCertificate.sol";
import "./EntitiesInterface.sol";
import "./AcademicDegree.sol";

contract GralEHR is OwnerInterface{  
    //attributes
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public government; 
   address public owner;
   ContractType public typeContract=ContractType.GralEHR;
   address private entitySC;

    struct GralEHR_Match{
        address ehr; // address of the EHR contract
        address birthCerSC; // address of the BirthCertificate contract
        address healthCP; // address of the healthcare professional
    }
    //We set the curp and it returns the digitalId and birthCer addresses.        
    mapping(string => GralEHR_Match) private curpMatches;
    

    modifier mustBeGovernment(address _entitySC){
      EntitiesInterface contractEntities = EntitiesInterface(_entitySC);    
      require(contractEntities.getType(msg.sender)==EntitiesInterface.EntityType.Government,"Incorrect government user");
      _;
    }


  constructor(address _entitySC) mustBeGovernment(_entitySC) {
    entitySC = _entitySC;
    dateCreation = block.timestamp;
    dateLastUpdate = dateCreation;
    government = msg.sender;
    owner = msg.sender;
  }


    modifier mustBeHealthCP(address _academicDeg){ // must be healthCare Professional  
      require(academicDeg.degreeIsTypeDegree(msg.sender,AcademicDegree.TypeDegree.Medicine),"Incorrect HealthCare Professional user");   
      _;
    }

    function createEHR(address _birthCerSC, string memory _curp) 
     public mustBeHealthCP {
      BirthCertificate bc = BirthCertificate(_birthCerSC);
      address digitalId = bc.digitalIdentity();
      require(digitalId!= address(0), "Incorrect digital identity address or birthcertificate address");
      require(bc.verifyCURP(_curp),"CURP does not corresponds to BirthCertificate");
      require(curpMatches[_curp].birthCerSC==address(0),"Curp already exists");
      EHR ehrAdd = new EHR(_curp,address(this),_birthCerSC,msg.sender);
      curpMatches[_curp] = GralEHR_Match(address(ehrAdd),_birthCerSC, msg.sender);
    }

    modifier ownerOrGovernment(string memory _curp){      
      EntitiesInterface contractEntities = EntitiesInterface(entitySC);      
      BirthCertificate bC = BirthCertificate(curpMatches[_curp].birthCerSC);
      require((msg.sender==bC.owner()) || (contractEntities.getType(msg.sender)==EntitiesInterface.EntityType.Government),"Owner or Governments can execute this method");
      _;
    }

    function getEHR_SC(string memory curp) public view ownerOrGovernment(curp) returns (address) {
      return curpMatches[curp].ehr; //if it does not exist returns address(0)
    }

    function getWhoCreatedEHR(string memory curp) public view ownerOrGovernment(curp) returns (address) {
      return curpMatches[curp].healthCP; //if it does not exist returns address(0)
    }

}
