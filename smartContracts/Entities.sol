// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./DigitalIdentity.sol";

contract Entities is OwnerInterface, EntitiesInterface{ 
    
    struct Entity {
        address creator; //who create the entity
        address dIdentity; //address of the digital identity
        bool active; //pinpoints if this entity is active or no
        EntityType entityType; 
    }   
    mapping(address => Entity) private entities;

      bool private active;
    address public owner;
    address public government;
    ContractName public nameContract = ContractName.Entities;
       uint public dateCreation;
       uint public dateLastUpdate;
       string private password;

    // Modifier to ensure the government and/or admin can execute some actions
    modifier onlyActiveGovernmentOrAdmin() {
        require(entities[msg.sender].entityType == EntityType.Government || entities[msg.sender].entityType == EntityType.Admin,
                "Only government or admin can perform this action."
            );
        require(entities[msg.sender].active,"Only ACTIVE government or admin can perform this action.");
        _;
    }

    //modifier to validate that entities exist
    modifier entityExistsIn(address _address) {
        require(entities[_address].creator!=address(0), "Entity does not exist.");
        _; 
    }

    modifier onlyAliveOwner() {
        require(msg.sender == owner, "Incorrect owner");
        require(active, "Owner must be alive");
        _;
    }

    constructor(string memory pass) {        
        dateCreation = block.timestamp;
        dateLastUpdate = dateCreation;        
        government = msg.sender; // A critical sender becomes the root government
        owner = government; //The government is also the owner
        entities[government] = Entity(government,address(0), true, EntityType.Government); 
        active = true;
        password = pass;
    }

    // Function to register new entities
    function registerEntity(
        address _entityAddress,
        EntityType _entityType
    ) public onlyAliveOwner onlyActiveGovernmentOrAdmin() {
        require(entities[_entityAddress].creator==address(0),"Entity already exists");
        dateLastUpdate = block.timestamp;  

        //A registration of an entity includes the creation of its DigitalIDentity
        DigitalIdentity didentityAdd = new DigitalIdentity(_entityAddress,address(this),msg.sender);
        entities[_entityAddress] = Entity(msg.sender, address(didentityAdd), true, _entityType);        
    }
    function setNotActive(string memory pass) public onlyAliveOwner() {        
        require(keccak256(bytes(password)) == keccak256(bytes(pass)), "Password is incorrect!");
        active = false;    
        entities[owner].active = active;    
    }

    function isActive() public view  returns (bool){
      return active;
    }

    function getType(address _address) public view entityExistsIn(_address) returns (EntityType) {
        return entities[_address].entityType;
    }

    function getCreator(address _address) public view entityExistsIn(_address) returns (address) {
        return entities[_address].creator;
    }

    function entityExists(address _address) public view returns (bool){
        bool r = entities[_address].creator!=address(0)?true:false;
        return(r);
    }

    function getDigIdentityAdd(address _address) public view entityExistsIn(_address) returns (address){
        return (entities[_address].dIdentity);
    }

    function setActiveOrInactiveAdd(address _address, bool _active) public entityExistsIn(_address) onlyActiveGovernmentOrAdmin() {
        require(_address!=owner,"Use setNotActive method to conver this smart contract in read-only");
        entities[_address].active = _active;
    }
    function isActive(address _address) public view entityExistsIn(_address) returns (bool){
        return (entities[_address].active);
    }

 }