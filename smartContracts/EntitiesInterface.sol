// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
interface EntitiesInterface {
        //Types of entities
        enum EntityType{
                Government, //Entity responsible for the system’s governance.
                Admin,  // Entity authorized to perform administrative operations.
                Individual, // Natural person participating in the system, such as a patient or healthcare professional.
                University //An academic institution that can participate in the system.
        }
        function getType(address) external view returns (EntityType); //get the specific type of a particular digital identity
        function getCreator(address _address) external view returns (address); //get the specific creator of a particular digital identity
        function getDigIdentityAdd(address _address) external view returns (address);//get the digital identity address of a particular entity (address)
        function entityExists(address _address) external view returns (bool);//get true when a particular identity address is already added
        function setActiveOrInactiveAdd(address _address, bool _active) external; //set if an entity will be active or inactive
        function isActive(address _address) external view returns (bool);//get true when a particular identity address is active
}