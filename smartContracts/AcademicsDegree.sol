// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;


import "./BirthCertificate.sol";
import "./EntitiesInterface.sol";


contract AcademicsDegree is OwnerInterface{  
  //This contract stores academic credentials and the validation of professional qualifications
  enum Degree{Undergraduate, Postgraduate, Master, Doctorate}
  enum TypeDegree{Nursing, Medicine, Engineering, Other}
      uint public dateCreation=0; // it contains the date the contract was created
      uint public dateLastUpdate=0;
   address public government; 
   address public owner;
   ContractName public nameContract=ContractName.AcademicsDegree;
  address private entitySC;

    struct Diploma{
        string idDegree; // identifier of the Diploma
        address owner; // owner of the Diploma
        address birthCertificate;
        string title; //Title of the degree
        uint date; //date of the achievement in epoch time
        Degree degree;
        TypeDegree typeDegree; 
        string details; //additional details of the degree
        bool active; //pinpoints if this diploma is active or not
        bool exists; //true is it exists
        uint lastUpdated; //when it was updated
    }
        
    mapping(string => Diploma) private diploma;
    mapping(address => string[]) private diplomasByOwner;
  
  
    modifier onlyActiveGovernmentOrAdmin(address _entitySC){
      EntitiesInterface contractEntities = EntitiesInterface(_entitySC);    
      require(contractEntities.getType(msg.sender)==EntitiesInterface.EntityType.Government || 
        contractEntities.getType(msg.sender)==EntitiesInterface.EntityType.Admin,"Only government or admin can perform this action.");
      require(contractEntities.isActive(msg.sender),"Only ACTIVE government or admin can perform this action.");
      _;
    }
    //modifier to validate that diploma exists
    modifier diplomaExistsIn(string memory _idDegree) {
        require(diploma[_idDegree].exists, "Diploma does not exist.");
        _; 
    }

    constructor(address _entitySC) onlyActiveGovernmentOrAdmin(_entitySC) {
      entitySC = _entitySC;
      dateCreation = block.timestamp;
      dateLastUpdate = dateCreation;
      government = msg.sender;
      owner = msg.sender;
    }


    function addDiploma(string memory idDegree, string memory title, uint date, Degree degree, TypeDegree typeDegree, string memory details, address _BirthCertificate, address _owner) 
     public onlyActiveGovernmentOrAdmin(entitySC) {
      BirthCertificate birthCer = BirthCertificate(_BirthCertificate); 
      require(birthCer.owner()==_owner,"Invalid birthcertificate addresss or owner address");
      require(!diploma[idDegree].exists, "idDegree already exists");      
      diploma[idDegree] = Diploma(idDegree,_owner,_BirthCertificate,title,date,degree,typeDegree,details,true,true,block.timestamp);
      diplomasByOwner[_owner].push(idDegree);
      dateLastUpdate = block.timestamp;
    }

    function setActiveOrInactiveDiploma(string memory _idDegree, bool _active) public diplomaExistsIn(_idDegree) onlyActiveGovernmentOrAdmin(entitySC) {
        diploma[_idDegree].active = _active;
        dateLastUpdate = block.timestamp;
    }

    function isActive(string memory _idDegree) public view diplomaExistsIn(_idDegree) returns (bool){
        return (diploma[_idDegree].active);
    }

    function ownerOfDiploma(string memory _idDegree) public view diplomaExistsIn(_idDegree) returns (address){
        return (diploma[_idDegree].owner);
    }

    function whatTypeDegree(string memory _idDegree) public view diplomaExistsIn(_idDegree) returns (TypeDegree){
        return (diploma[_idDegree].typeDegree);
    }

    //This function checks if the introduced degree matches with the introduced address
    function degreeIsTypeDegree(address add, TypeDegree typeDegree) public view returns (bool) {
      string[] storage ids = diplomasByOwner[add];
      for (uint i = 0; i < ids.length; i++) {
        if (diploma[ids[i]].typeDegree == typeDegree) {
            return true;
        }
      }
      return false;    
    }

    //This function checks if the introduced degree matches with the introduced address and whether is active
    function degreeIsActiveTypeDegree(address add, TypeDegree typeDegree) public view returns (bool) {
      string[] storage ids = diplomasByOwner[add];
      for (uint i = 0; i < ids.length; i++) {
        if (diploma[ids[i]].typeDegree == typeDegree) {
            return diploma[ids[i]].active;
        }
      }
      return false;    
    }


}