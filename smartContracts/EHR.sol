// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./DigitalIdentity.sol";
import "./BirthCertificate.sol";

contract EHR is OwnerInterface, DateInterface{  
    //attributes
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public owner;
   ContractType public typeContract=ContractType.EHR;
    address public government; //healthcare professional who created the EHR
    address private healthCP; //healthcare professional who created the EHR
    address private entitySC;
   string private curp;
   address private birthCerAdd;
   
  event healthCPTransactions(
      address indexed executor,
         uint dateCreation
  );

    struct HealthRecord{
        bytes32 idH; // identifier in the off-chain in hash format
        bytes32 titleHash; //the title hash of the record
        uint date; //date of the record in epoch time
        bytes32 sectionHash; //section hash of the NOM-004
        bytes32 hashDetails; //General details stored in Hash format
        address healthCP; //healt-care who stored the clinic history
    }
        
    mapping(bytes32 => HealthRecord) private healthRecords;
    //uint private idAch=0;

  constructor(string memory _curp, address _gralEHR, address _birthCerAdd, address _healthCP){    
    //This line is checking if the contract is called by other contract.
    require(msg.sender.code.length > 0,"It was not called by a contract");
    require(msg.sender==_gralEHR,"Error: incorrect sender");
    BirthCertificate bc = BirthCertificate(_birthCerAdd);
    
    //DigitalIdentity digIdentity = DigitalIdentity(bc.digitalIdentity());
    entitySC = bc.entitySC();
    birthCerAdd = _birthCerAdd;
    owner = bc.owner();
    government = _healthCP;
    healthCP = _healthCP;
    curp = _curp;
    dateCreation = block.timestamp;
    dateLastUpdate = dateCreation;       
    emit healthCPTransactions(msg.sender,dateCreation);
  }

    modifier mustBeHealthCP(){ // must be healthCare Professional  
      EntitiesInterface contractUsers = EntitiesInterface(entitySC);
      require(contractUsers.getType(msg.sender)==24,"Incorrect HealthCare Professional user");   
      _;
    }

    /**
     * @notice It adds a health record within the smart contract EHR
     * @dev Requires that the health record does not already exist. Reverts if idH is taken.
     * @param idH Unique identifier in hash format
     * @param titleH The title of the health record in hash format
     * @param sectionH Corresponds to the Mexican NOM section 004 stored in hash format
     * @param details Corresponds to the content of the record being stored in hash format
     */
    function addHealthRecord(bytes32 idH, bytes32 titleH, bytes32 sectionH, bytes32 details) 
     public mustBeHealthCP {
        require(healthRecords[idH].idH==bytes32(0),"Error: Id already exists");
        healthRecords[idH] = HealthRecord(idH,titleH,block.timestamp,sectionH,details, msg.sender);
    }

    function checkEHRIntegrity(bytes32 idH, bytes32 titleH, bytes32 sectionH, bytes32 hashDetails) public view returns (bool) {      
        if(healthRecords[idH].idH==idH && healthRecords[idH].titleHash==titleH && healthRecords[idH].sectionHash==sectionH && healthRecords[idH].hashDetails==hashDetails) 
          return true;
        else return false;
    }


    modifier ownerGovernmentOrHealthCP(){      
      EntitiesInterface contractUsers = EntitiesInterface(entitySC);    
      require((msg.sender==owner) || (contractUsers.getType(msg.sender)==0) || (msg.sender==healthCP),"Owner or Governments can execute this method");
      _;
    }

    function getBirthCertificate() public view ownerGovernmentOrHealthCP returns (address){
      return birthCerAdd;
    }

}
