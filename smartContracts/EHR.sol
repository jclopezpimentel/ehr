// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./BirthCertificate.sol";
//importing the interface
//import "./OwnerInterface.sol";
//import "./UsersInterface.sol";


contract EHR{  
    //attributes
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public government; 
   address public owner;
    string public nameToken="EHR";
  address private birthCer;
   address private cUsers;
   
  event governmentTransactions(
      address indexed executor,
         uint dateCreation
  );

    struct HealthRecord{
        string id; // identifier of the record
        string title; //the title of the record
        string date; //date of the record in epoch time
        string hashDetails; //details stored in Hash format
    }
        
    mapping(uint => HealthRecord) private healthRecords;
    uint private idAch=0;

  constructor(address birthC, address _contractUsers, address _owner) {
    //BirthCertificate birthCer = BirthCertificate(birthC);     
    birthCer = birthC;
    dateCreation = block.timestamp;    
    cUsers = _contractUsers;
    UsersInterface contractUsers = UsersInterface(cUsers);    
    require(contractUsers.getCreator(_owner)!=address(0),"User already exists");
    require(contractUsers.getType(msg.sender)==0,"Incorrect government user");

    government = msg.sender;
    owner = _owner;
    emit governmentTransactions(msg.sender,dateCreation);

  }

    modifier mustBeHealthCP(){ // must be healthCare Professional  
      UsersInterface contractUsers = UsersInterface(cUsers);
      require(contractUsers.getType(msg.sender)==10,"Incorrect HealthCare Professional user");   
      //require(msg.sender==government,"Executor must be the University");
      _;
    }

    function addHealthRecord(string memory id, string memory title, string memory date, string memory hashDetails) 
     public mustBeHealthCP {
        healthRecords[idAch] = HealthRecord(id,title,date,hashDetails);
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
}
