// SPDX-License-Identifier: MIT
pragma solidity 0.8.36;
interface EntitiesInterface {
        function getType(address) external view returns (int);
        function getCreator(address _address) external view returns (address);
        function getDigIdentityAdd(address _address) external view returns (address);
        function entityExists(address _address) external view returns (bool);
}    
