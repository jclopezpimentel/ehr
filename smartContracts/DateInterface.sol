// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;
interface DateInterface {
        function dateCreation() external view returns (uint);
        function dateLastUpdate() external view returns (uint); 
}    
