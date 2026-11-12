// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "./DigitalIdentity.sol";

contract Entities is OwnerInterface, EntitiesInterface{

    struct Entity {
        address creator;       // Who created the entity
        address dIdentity;     // Address of the digital identity
        bool active;           // Indicates whether the entity is active
        EntityType entityType;
    }

    mapping(address => Entity) private entities;

    bool private active;
    bool public governanceDisabled; // Global deactivation flag

    address public owner;
    address public government;

    ContractName public nameContract = ContractName.Entities;

    uint public dateCreation;
    uint public dateLastUpdate;

    string private password;

    // Modifier to ensure that only active governments or admins
    // can execute specific operations
    modifier onlyActiveGovernmentOrAdmin() {

        require(!governanceDisabled,
            "Governance has been disabled.");

        require(
            entities[msg.sender].entityType == EntityType.Government ||
            entities[msg.sender].entityType == EntityType.Admin,
            "Only government or admin can perform this action."
        );

        require(
            entities[msg.sender].active,
            "Only ACTIVE government or admin can perform this action."
        );

        _;
    }

    // Modifier to validate that entities exist
    modifier entityExistsIn(address _address) {
        require(
            entities[_address].creator != address(0),
            "Entity does not exist."
        );
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

        government = msg.sender;
        owner = government;

        entities[government] = Entity(
            government,
            address(0),
            true,
            EntityType.Government
        );

        active = true;
        governanceDisabled = false;

        password = pass;
    }

    // Function to register new entities
    function registerEntity(
        address _entityAddress,
        EntityType _entityType
    )
        public
        onlyAliveOwner
        onlyActiveGovernmentOrAdmin
    {
        require(
            entities[_entityAddress].creator == address(0),
            "Entity already exists"
        );

        dateLastUpdate = block.timestamp;

        // Creation of the entity's DigitalIdentity
        DigitalIdentity didentityAdd = new DigitalIdentity(
            _entityAddress,
            address(this),
            msg.sender
        );

        entities[_entityAddress] = Entity(
            msg.sender,
            address(didentityAdd),
            true,
            _entityType
        );
    }

    // Deactivates the entire governance mechanism
    function setNotActive(string memory pass)
        public
        onlyAliveOwner
    {
        require(
            keccak256(bytes(password)) == keccak256(bytes(pass)),
            "Password is incorrect!"
        );

        // Disable all governments and administrators logically
        governanceDisabled = true;

        // Deactivate the Entities smart contract
        active = false;

        // Deactivate the initial government
        entities[owner].active = false;

        dateLastUpdate = block.timestamp;
    }

    function isActive() public view returns (bool) {
        return active;
    }

    function getType(address _address)
        public
        view
        entityExistsIn(_address)
        returns (EntityType)
    {
        return entities[_address].entityType;
    }

    function getCreator(address _address)
        public
        view
        entityExistsIn(_address)
        returns (address)
    {
        return entities[_address].creator;
    }

    function entityExists(address _address)
        public
        view
        returns (bool)
    {
        return entities[_address].creator != address(0);
    }

    function getDigIdentityAdd(address _address)
        public
        view
        entityExistsIn(_address)
        returns (address)
    {
        return entities[_address].dIdentity;
    }

    function setActiveOrInactiveAdd(
        address _address,
        bool _active
    )
        public
        entityExistsIn(_address)
        onlyActiveGovernmentOrAdmin
    {
        require(
            _address != owner,
            "Use setNotActive method to convert this smart contract into read-only"
        );

        entities[_address].active = _active;
    }

    function isActive(address _address)
        public
        view
        entityExistsIn(_address)
        returns (bool)
    {
        // Governments and administrators are logically inactive
        // when the global governance flag is enabled
        if (
            entities[_address].entityType == EntityType.Government ||
            entities[_address].entityType == EntityType.Admin
        ) {
            return entities[_address].active && !governanceDisabled;
        }

        return entities[_address].active;
    }

}