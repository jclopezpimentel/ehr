// SPDX-License-Identifier: MIT
pragma solidity ^0.8.34;

import "./DigitalIdentity.sol";

contract Entities is OwnerInterface, EntitiesInterface, DateInterface{ 
    struct Entity {
        address creator; //who create the entity
        address dIdentity; //address of the digital identity
        int entityType; //int (0 = Government, 1 = Admin, 10 = humans, others = regular entities)
    }   
    mapping(address => Entity) private entities;

    address public owner;
     string public nameToken="Entities";
    address public government;
       uint public dateCreation;
       uint public dateLastUpdate;

    // Modifier to ensure the government and/or admin can execute some actions
    modifier onlyGovernmentOrAdmin(int _entityType) {
        if(_entityType==0){
            require(
                entities[msg.sender].entityType == 0,
                "Only government can perform this action."
            );            
        }else{
            require(
                entities[msg.sender].entityType == 0 || entities[msg.sender].entityType == 1,
                "Only government or admin can perform this action."
            );
        }
        _;
    }

    //modifier to validate that entities exist
    modifier entityExistsIn(address _address) {
        require(entities[_address].creator!=address(0), "Entity does not exist.");
        _; 
    }

    constructor() {        
        dateCreation = block.timestamp;
        dateLastUpdate = dateCreation;        
        government = msg.sender; // The government deploy the contract
        owner = government; //The government is also the owner
        // Setting government entityType to 0
        entities[government] = Entity(government,address(0), 0); 
    }

    // Function to add new entities
    function registerEntity(
        address _entityAddress,
        int _entityType
    ) public onlyGovernmentOrAdmin(_entityType) {
        require(entities[_entityAddress].creator==address(0),"Entity already exists");
        require(_entityType >= 0, "EntityType must be a non-negative integer."); // Validation for entityType
        dateLastUpdate = block.timestamp;        
        DigitalIdentity didentityAdd = new DigitalIdentity(_entityAddress,address(this),msg.sender);
        entities[_entityAddress] = Entity(msg.sender, address(didentityAdd), _entityType);        
    }

    function getType(address _address) public view entityExistsIn(_address) returns (int) {
        return entities[_address].entityType;
    }

    function getCreator(address _address) public view entityExistsIn(_address) returns (address) {
        return entities[_address].creator;
    }

    function entityExists(address _address) public view returns (bool){
        bool r = entities[_address].creator!=address(0)?true:false;
        return(r);
    }

    function getDigIdentityAdd(address _address) public view returns (address){
        return (entities[_address].dIdentity);
    }
 }