// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./DigitalIdentity.sol";

contract Entities is OwnerInterface, EntitiesInterface{ 
    
    struct Entity {
        address creator; //who create the entity
        address dIdentity; //address of the digital identity
        EntityType entityType; 
    }   
    mapping(address => Entity) private entities;

    address public owner;
    address public government;
    ContractName public namecontract = ContractName.Entities;
       uint public dateCreation;
       uint public dateLastUpdate;

    // Modifier to ensure the government and/or admin can execute some actions
    modifier onlyGovernmentOrAdmin(EntityType _entityType) {
        if(_entityType==EntityType.Government){
            require(
                entities[msg.sender].entityType == EntityType.Government,
                "Only government can perform this action."
            );            
        }else{
            require(
                entities[msg.sender].entityType == EntityType.Government || entities[msg.sender].entityType == EntityType.Admin,
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
        entities[government] = Entity(government,address(0), EntityType.Government); 
    }

    // Function to add new entities
    function registerEntity(
        address _entityAddress,
        EntityType _entityType
    ) public onlyGovernmentOrAdmin(_entityType) {
        require(entities[_entityAddress].creator==address(0),"Entity already exists");
        dateLastUpdate = block.timestamp;        
        DigitalIdentity didentityAdd = new DigitalIdentity(_entityAddress,address(this),msg.sender);
        entities[_entityAddress] = Entity(msg.sender, address(didentityAdd), _entityType);        
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

    function getDigIdentityAdd(address _address) public view returns (address){
        return (entities[_address].dIdentity);
    }
 }