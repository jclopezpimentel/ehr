// SPDX-License-Identifier: MIT
pragma solidity 0.8.34;
interface OwnerInterface {
        function owner() external view returns (address);
        function typeContract() external view returns (string memory); 
        function government() external view returns (address);
}    
