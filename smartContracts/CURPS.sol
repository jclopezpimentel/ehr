// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./BirthCertificate.sol";
//import "./DigitalIdentity.sol";

contract CURPS is OwnerInterface{  
    //attributes
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public government; 
   address public owner;
    string public nameToken="CURPS";
   address private cUsers;

    struct CURP_MATCH{
        address birthCer; 
    }
    //We set the curp and it returns the digitalId and birthCer addresses.        
    mapping(string => CURP_MATCH) private curpMatches;
    //uint private idAch=0;

  constructor(address _contractUsers) {
    cUsers = _contractUsers;
    UsersInterface contractUsers = UsersInterface(cUsers);    
    //The following instruction guarantees that a government creates this contract
    require(contractUsers.getType(msg.sender)==0,"Incorrect government user");
    dateCreation = block.timestamp;
    dateLastUpdate = dateCreation;
    government = msg.sender;
    owner = msg.sender;
  }

    modifier mustBeGovernment(){
      UsersInterface contractUsers = UsersInterface(cUsers);    
      require(contractUsers.getType(msg.sender)==0,"Incorrect government user");
      _;
    }

    modifier ownerOrGovernment(string memory _curp){      
      UsersInterface contractUsers = UsersInterface(cUsers);
      
      BirthCertificate bc = BirthCertificate(curpMatches[_curp].birthCer);
      require((msg.sender==bc.owner()) || (contractUsers.getType(msg.sender)==0),"Owner or Governments can execute this method");
      _;
    }

    function addCURP(string memory _curp, address _birthCer) 
     public mustBeGovernment {
        curpMatches[_curp] = CURP_MATCH(_birthCer);
    }

    function getBirthCertificate(string memory curp) public view ownerOrGovernment(curp) returns (address) {
      return curpMatches[curp].birthCer; //if it does not exist returns address(0)
    }
}
