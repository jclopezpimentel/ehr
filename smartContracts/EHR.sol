// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

import "./DigitalIdentity.sol";

contract EHR is OwnerInterface, DateInterface{  
    //attributes
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public owner;
    string public nameToken="EHR";
    address public government; //healthcare professional who created the EHR
    address private healthCP; //healthcare professional who created the EHR
    address private addOfEntities;
   string private curp;
   address private birthCerAdd;
   
  event healthCPTransactions(
      address indexed executor,
         uint dateCreation
  );

    struct HealthRecord{
        string id; // identifier in the off-chain
        string title; //the title of the record
        uint date; //date of the record in epoch time
        string section; //section of the NOM-004
        string hashDetails; //details stored in Hash format
        address healthCP; //healt-care who stored the clinic history
    }
        
    mapping(uint => HealthRecord) private healthRecords;
    uint private idAch=0;

  constructor(address _digIdentity, string memory _curp, address _gralEHR, address _birthCerAdd, address _healthCP){    
    //This line is checking if the contract is called by other contract.
    require(msg.sender.code.length > 0,"It was not called by a contract");
    require(msg.sender==_gralEHR,"Error: incorrect sender");
    DigitalIdentity digIdentity = DigitalIdentity(_digIdentity);
    addOfEntities = digIdentity.addOfEntities();
    birthCerAdd = _birthCerAdd;
    owner = digIdentity.owner();
    government = _healthCP;
    healthCP = _healthCP;
    curp = _curp;
    dateCreation = block.timestamp;
    dateLastUpdate = dateCreation;       
    emit healthCPTransactions(msg.sender,dateCreation);
  }

    modifier mustBeHealthCP(){ // must be healthCare Professional  
      EntitiesInterface contractUsers = EntitiesInterface(addOfEntities);
      require(contractUsers.getType(msg.sender)==24,"Incorrect HealthCare Professional user");   
      _;
    }

    function addHealthRecord(string memory id, string memory title, string memory _section, string memory hashDetails) 
     public mustBeHealthCP {
        healthRecords[idAch] = HealthRecord(id,title,block.timestamp,_section,hashDetails, msg.sender);
        idAch++;
    }

    function numberOfRecords() public view returns (uint) {        
        return (idAch);
    }

    function getRecord(uint id) public view returns (string memory) {
        require((idAch>0 && idAch>id),"Error: not record for such id");
        return string(
                        abi.encodePacked(
                            "{",
                            '"id":"', healthRecords[id].id, '",',
                            '"title":"', healthRecords[id].title, '",',
                            '"date":"', healthRecords[id].date, '",',
                            '"hashDetails":"', healthRecords[id].hashDetails, '"',
                            "}"
                        )
                    );
    }

    modifier ownerGovernmentOrHealthCP(){      
      EntitiesInterface contractUsers = EntitiesInterface(addOfEntities);    
      require((msg.sender==owner) || (contractUsers.getType(msg.sender)==0) || (msg.sender==healthCP),"Owner or Governments can execute this method");
      _;
    }

    function getBirthCertificate() public view ownerGovernmentOrHealthCP returns (address){
      return birthCerAdd;
    }

}
