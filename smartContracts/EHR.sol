// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./BirthCertificate.sol";
import "./CURPS.sol";
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
   address private cUsers;
   string private curp;
   
  event governmentTransactions(
      address indexed executor,
         uint dateCreation
  );

    struct HealthRecord{
        string id; // identifier of the record
        string title; //the title of the record
        string date; //date of the record in epoch time
        string hashDetails; //details stored in Hash format
        address healthCP; //healt-care who stored the clinic history
    }
        
    mapping(uint => HealthRecord) private healthRecords;
    uint private idAch=0;

  constructor(address _contractUsers, address _owner, string memory _curp, address _contractCURP) {
    CURPS curpF  = CURPS(_contractCURP); 
    //address birthC = curpF.getBirthCertificate(_curp);
    BirthCertificate birthCer = BirthCertificate(curpF.getBirthCertificate(_curp));     
    //birthCer = birthC;
    //Parameter _owner is introuced to verify if it corresponds to the previous introduced _curp
    require(_owner==birthCer.owner(),"Onwer or curp is incorrect");
    owner = _owner;
    UsersInterface contractUsers = UsersInterface(_contractUsers);    
    require(contractUsers.getType(msg.sender)==0,"Incorrect government user");
    government = msg.sender;
    cUsers = _contractUsers;
    require(birthCer.owner()!=address(0),"User already exists");
    curp = _curp;
    dateCreation = block.timestamp;       
    emit governmentTransactions(msg.sender,dateCreation);
  }

    modifier mustBeHealthCP(){ // must be healthCare Professional  
      UsersInterface contractUsers = UsersInterface(cUsers);
      require(contractUsers.getType(msg.sender)==10,"Incorrect HealthCare Professional user");   
      _;
    }

    function addHealthRecord(string memory id, string memory title, string memory date, string memory hashDetails) 
     public mustBeHealthCP {
        healthRecords[idAch] = HealthRecord(id,title,date,hashDetails, msg.sender);
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
