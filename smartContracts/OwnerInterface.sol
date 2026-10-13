// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
interface OwnerInterface {
        function owner() external view returns (address);
        function typeContract() external view returns (int); 
        function government() external view returns (address);
}    
