// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
interface EntitiesInterface {
        //Types of entities
        enum EntityType{Government,Admin,Individual,University}
        function getType(address) external view returns (EntityType); //get the specific type of a particular digital identity
        function getCreator(address _address) external view returns (address); //get the specific creator of a particular digital identity
        function getDigIdentityAdd(address _address) external view returns (address);//get the digital identity address of a particular entity (address)
        function entityExists(address _address) external view returns (bool);//get true when a particular identity address is already added
}    
