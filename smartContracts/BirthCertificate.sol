// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;

//importing the interface
//import "./OwnerInterface.sol";
//import "./EntitiesInterface.sol";
import "./DigitalIdentity.sol";

contract BirthCertificate is OwnerInterface{  
    //attributes
    string public name; 
    string public fLastName; //father last name
    string public mLastName; //father last name
      bool private genderM; //true will be man and false woman
      uint private birthday; //unix epoch
    uint16 private locality; //locality of birthdate: it is only the code
    uint16 private municipalty; //municipalty of birthdate: it is only the code      
    uint16 private state; //state of birthdate: it is only the code    
    uint16 private country; //country of birthdate: it is only the code  
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public tokenFather; //null 0x0000000000000000000000000000000000000000
   address public tokenMother;
   address public government;
   address public owner;
    string public nameToken="BirthCertificate";
    address public digitalIdentity; // This is the digital identity of the user
   address private addOfEntities;
   
  event governmentTransactions(
      address indexed executor,
         uint dateCreation
  );

  constructor(string memory _name, string memory _fLastName, string memory _mLastName, bool _gender, 
              uint _birthday, uint16 _locality, uint16 _municipality, uint16 _state, uint16 _country,
              address _contractUsers, address _digIden) {
    DigitalIdentity dIdentity = DigitalIdentity(_digIden);
    owner = dIdentity.owner();
    addOfEntities = _contractUsers;
    EntitiesInterface contractUsers = EntitiesInterface(addOfEntities);    
    require(contractUsers.getCreator(owner)!=address(0),"User already exists");
    require(contractUsers.getType(msg.sender)==0,"Incorrect government user");
    
    name = _name; 
    fLastName = _fLastName; 
    mLastName = _mLastName; 
    genderM = _gender; //true will be man and false woman
    birthday = _birthday;     
    locality = _locality;
    municipalty = _municipality;
    state =_state;
    country = _country;
    dateCreation = block.timestamp;
    dateLastUpdate = dateCreation;
    tokenFather=address(0);
    tokenMother=address(0);
    government = msg.sender;
    emit governmentTransactions(msg.sender,dateCreation);
  }

    modifier mustBeGovernment(){
      EntitiesInterface contractUsers = EntitiesInterface(addOfEntities);    
      require(contractUsers.getType(msg.sender)==0,"Incorrect government user");
      _;
    }
    modifier ownerOrGovernment(){      
      EntitiesInterface contractUsers = EntitiesInterface(addOfEntities);    
      require((msg.sender==owner) || (contractUsers.getType(msg.sender)==0),"Owner or Governments can execute this method");
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
    

}
