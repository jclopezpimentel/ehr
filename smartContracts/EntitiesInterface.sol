// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
interface EntitiesInterface {
        enum EntityType{Government,Admin,Human,University}
        function getType(address) external view returns (EntityType);
        function getCreator(address _address) external view returns (address);
        function getDigIdentityAdd(address _address) external view returns (address);
        function entityExists(address _address) external view returns (bool);
}    
