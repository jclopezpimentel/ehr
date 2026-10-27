// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import "./OwnerInterface.sol";
import "./EntitiesInterface.sol";


contract DigitalIdentity is OwnerInterface{  
    //errors
        string constant INCORRECT_GOVERNMENT = "V0001";
        string constant INCORRECT_OWNER = "V0002";
        string constant INCORRECT_OWNER_OF_CONTRACTADDRESS = "V0003";        
        string constant TOKEN_ALREADY_EXIST = "V0004"; 
        string constant NOT_GOVERNMENT = "V0005";
        
    //attributes
        address public owner;
        ContractType public typeContract=ContractType.DigitalIdentity;
        address public government;
        address public addOfEntities;
           uint public dateCreation;
           uint public dateLastUpdate;


        struct LinkedContract{
                address contractAdd; //contract to be added
                ContractType typeContract; 
                address creator; //Address creator of the token, usually could be the government
                bool gcert; //true if the linked token is really a verified government
                            //false if not
                bool exists; // Boolean flag to track whether a entity exists 
        }
        
        mapping(address => LinkedContract) private linkedContracts;
        address[] private addressesContracts;

    constructor(address _owner, address _contractOfEntities, address gover) { 
        //This line is checking if the contract is called by other contract.   
        require(msg.sender.code.length > 0,"It was not called by a contract");
        require(msg.sender==_contractOfEntities,"Error: incorrect sender");        
        EntitiesInterface contractEntities = EntitiesInterface(_contractOfEntities);
        require(contractEntities.getType(gover)==EntitiesInterface.EntityType.Government,INCORRECT_GOVERNMENT);
        dateCreation = block.timestamp;
        dateLastUpdate = dateCreation;        
        addOfEntities = _contractOfEntities;
        government = gover;        
        owner = _owner;
    }

    function linkContract(address contractAdd) public {
        require(msg.sender==owner,INCORRECT_OWNER);
        OwnerInterface contractFrom = OwnerInterface(contractAdd);
        require(msg.sender==contractFrom.owner(),INCORRECT_OWNER_OF_CONTRACTADDRESS);        
        require(contractFrom.government()!=address(0),NOT_GOVERNMENT);
        require(!linkedContracts[contractAdd].exists,TOKEN_ALREADY_EXIST);
        EntitiesInterface contractEntities = EntitiesInterface(addOfEntities);
        bool gcert=false;
        if(contractEntities.entityExists(contractFrom.government())){
            gcert = (contractEntities.getType(contractFrom.government())==EntitiesInterface.EntityType.Government?true:false);
        }        
        linkedContracts[contractAdd] = LinkedContract(contractAdd,contractFrom.typeContract(),
            contractFrom.government(),gcert,true);
        addressesContracts.push(contractAdd);
        dateLastUpdate = block.timestamp;        
    }

    function numberOfLinkedContracts() public view returns (uint) {        
        return (addressesContracts.length);
    }

    function getContractType(address _contractAdd) public view returns (ContractType) {
        LinkedContract memory lToken = linkedContracts[_contractAdd];
        return (lToken.typeContract);
    }

    function creatorIsGovernment(address _contractAdd) public view returns (bool) {
        LinkedContract memory lToken = linkedContracts[_contractAdd];
        return (lToken.gcert);
    }

    function getCreatorOfContract(address _contractAdd) public view returns (address) {
        LinkedContract memory lToken = linkedContracts[_contractAdd];
        return (lToken.creator);
    }
 }