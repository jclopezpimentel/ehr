// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

import "./EHR.sol";

contract GralEHR is OwnerInterface{  
    //attributes
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public government; 
   address public owner;
    string public nameToken="GralEHR";
   address private addOfEntities;

    struct GralEHR_Match{
        address digId; // address of the digital identity
        address ehr; // address of the EHR contract
        address healthCP; // address of the healthcare professional
    }
    //We set the curp and it returns the digitalId and birthCer addresses.        
    mapping(string => GralEHR_Match) private curpMatches;
    

    modifier mustBeGovernment(address _contractU){
      EntitiesInterface contractUsers = EntitiesInterface(_contractU);    
      require(contractUsers.getType(msg.sender)==0,"Incorrect government user");
      _;
    }


  constructor(address _contractUsers) mustBeGovernment(_contractUsers) {
    addOfEntities = _contractUsers;
    dateCreation = block.timestamp;
    dateLastUpdate = dateCreation;
    government = msg.sender;
    owner = msg.sender;
  }


    modifier mustBeHealthCP(){ // must be healthCare Professional  
      EntitiesInterface contractUsers = EntitiesInterface(addOfEntities);
      require(contractUsers.getType(msg.sender)==24,"Incorrect HealthCare Professional user");   
      _;
    }

    function addEHR(string memory _curp, address _digitalId, address _owner) 
     public mustBeHealthCP {
          //Parameter _owner is introuced to verify if it corresponds to the previous introduced _curp
      require(curpMatches[_curp].digId==address(0),"Curp already exists");
      DigitalIdentity didentityAdd = DigitalIdentity(_digitalId);
      require(didentityAdd.owner()==_owner,"Owner address does not match with digital identity");
      EHR ehrAdd = new EHR(_digitalId,_curp,address(this),msg.sender);
        curpMatches[_curp] = GralEHR_Match(_digitalId,address(ehrAdd),msg.sender);
    }

    modifier ownerOrGovernment(string memory _curp){      
      EntitiesInterface contractUsers = EntitiesInterface(addOfEntities);      
      DigitalIdentity dI = DigitalIdentity(curpMatches[_curp].digId);
      require((msg.sender==dI.owner()) || (contractUsers.getType(msg.sender)==0),"Owner or Governments can execute this method");
      _;
    }

    function getEHRAddress(string memory curp) public view ownerOrGovernment(curp) returns (address) {
      return curpMatches[curp].ehr; //if it does not exist returns address(0)
    }

    function whoCreatedThisEHR(string memory curp) public view ownerOrGovernment(curp) returns (address) {
      return curpMatches[curp].healthCP; //if it does not exist returns address(0)
    }

}
