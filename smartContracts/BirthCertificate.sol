// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;


import "./DigitalIdentity.sol";
import "./EntitiesInterface.sol";

contract BirthCertificate is OwnerInterface{  
    //attributes
    struct FullName{
      string name; 
      string fLastName; //father last name
      string mLastName; //mother last name

    }

    FullName private fullName;
      bool private genderM; //true will be man and false woman
      uint private birthday; //unix epoch
    uint16 private locality; //locality of birthdate: it is only the code
    uint16 private municipalty; //municipalty of birthdate: it is only the code      
    uint16 private state; //state of birthdate: it is only the code    
    uint16 private country; //country of birthdate: it is only the code  
    string private curp; // Unique key of population register
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public tokenFather; //null 0x0000000000000000000000000000000000000000
   address public tokenMother;
   address public government;
   address public owner;
   ContractName public nameContract=ContractName.BirthCertificate;
    address public digitalIdentity; // This is the digital identity of the user
   address public entitySC;
   
  event governmentTransactions(
      address indexed executor,
         uint dateCreation
  );

  constructor(FullName memory _fullName, bool _gender, 
              uint _birthday, uint16 _locality, uint16 _municipality, uint16 _state, uint16 _country, string memory _curp,
              address _contractEntities, address _digIden) {
    DigitalIdentity dIdentity = DigitalIdentity(_digIden);
    digitalIdentity = _digIden;
    owner = dIdentity.owner();
    entitySC = _contractEntities;
    EntitiesInterface contractUsers = EntitiesInterface(entitySC);    
    require(contractUsers.getCreator(owner)!=address(0),"User already exists");
    require(contractUsers.getType(msg.sender)==EntitiesInterface.EntityType.Government,"Incorrect government user");
    fullName = _fullName;
    genderM = _gender; //true will be man and false woman
    birthday = _birthday;     
    locality = _locality;
    municipalty = _municipality;
    state =_state;
    country = _country;
    curp = _curp;
    dateCreation = block.timestamp;
    dateLastUpdate = dateCreation;
    tokenFather=address(0);
    tokenMother=address(0);
    government = msg.sender;
    emit governmentTransactions(msg.sender,dateCreation);
  }

    modifier mustBeGovernment(){
      EntitiesInterface contractUsers = EntitiesInterface(entitySC);    
      require(contractUsers.getType(msg.sender)==EntitiesInterface.EntityType.Government,"Incorrect government user");
      _;
    }
    modifier ownerOrGovernment(){      
      EntitiesInterface contractUsers = EntitiesInterface(entitySC);    
      require((msg.sender==owner) || (contractUsers.getType(msg.sender)==EntitiesInterface.EntityType.Government),"Owner or Governments can execute this method");
      _;
    }

    function setFatherAddress(address fAddress) public mustBeGovernment {        
        tokenFather = fAddress;
        dateLastUpdate = block.timestamp;
        emit governmentTransactions(msg.sender,dateCreation);
    }

    function setMotherAddress(address mAddress) public mustBeGovernment {        
        tokenMother = mAddress;
        dateLastUpdate = block.timestamp;
        emit governmentTransactions(msg.sender,dateCreation);
    }

    function getName() public view  ownerOrGovernment returns (string memory){
      return fullName.name;
    }

    function getFatherLastName() public view  ownerOrGovernment returns (string memory){
      return fullName.fLastName;
    }

    function getMotherLastName() public view  ownerOrGovernment returns (string memory){
      return fullName.mLastName;
    }

    function getFullName() public view  ownerOrGovernment returns (string memory){
      return string.concat(fullName.name," ",fullName.fLastName," ",fullName.mLastName);
    }


    function isMale() public view ownerOrGovernment returns (bool){
      return genderM;
    }


    function getBirthDay() public view ownerOrGovernment returns (uint){
      return birthday;
    }

    function getLocality() public view ownerOrGovernment returns (uint16){
      return locality;
    }

    function getMunicipalty() public view ownerOrGovernment returns (uint16){
      return municipalty;
    }

    function getState() public view ownerOrGovernment returns (uint16){
      return state;
    }

    function getCountry() public view ownerOrGovernment returns (uint16){
      return country;
    }
    
    function getCURP() public view ownerOrGovernment returns (string memory){
      return curp;
    }

    function verifyCURP(string memory _curp) public  view  returns  (bool){
      return (keccak256(bytes(curp)) == keccak256(bytes(_curp)));
    }
}
