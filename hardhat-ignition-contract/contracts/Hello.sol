//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Hello {
    string private name;

    constructor(string memory _name) {
        name = _name;
    }

    function sayHello() public view returns (string memory) {
        return string(abi.encodePacked("Hello, ", name));
    }
    function justSayHello() public pure returns (string memory) {
        return "Hello";
    }}
