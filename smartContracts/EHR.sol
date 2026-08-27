// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

//import "./OwnerInterface.sol";
import "./DigitalIdentity.sol";

contract EHR is OwnerInterface{  
    //attributes
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public owner;
    string public nameToken="EHR";
    address public government; //healthcare professional who created the EHR
    address private healthCP; //healthcare professional who created the EHR
    address private cUsers;
   string private curp;
   
  event healthCPTransactions(
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

  constructor(address _digIdentity, string memory _curp, address _contractGralEHR, address _healthCP){    
    require(msg.sender==_contractGralEHR,"Error: incorrect sender");
    DigitalIdentity digIdentity = DigitalIdentity(_digIdentity);
    cUsers = digIdentity.contractAddOfEntities();
    owner = digIdentity.owner();
    government = _healthCP;
    healthCP = _healthCP;
    curp = _curp;
    dateCreation = block.timestamp;       
    emit healthCPTransactions(msg.sender,dateCreation);
  }

    modifier mustBeHealthCP(){ // must be healthCare Professional  
      EntitiesInterface contractUsers = EntitiesInterface(cUsers);
      require(contractUsers.getType(msg.sender)==24,"Incorrect HealthCare Professional user");   
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
