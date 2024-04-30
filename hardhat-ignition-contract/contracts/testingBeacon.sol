// SPDX-License-Identifier:MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";


contract LeaseV1 is Initializable {
    uint public value ;

    function initialize(uint _value ) public initializer {
       value= _value;
        
    }
function decrement()public {
    value--;
}
}
contract LeaseV2 is Initializable {
    uint public value ;

    function initialize(uint _value ) public initializer {
       value= _value;
        
    }
function decrement()public {value--;}
function increment()public {value++;}
}   

contract LeaseBeacon is UpgradeableBeacon{

  constructor(address implementation_, address initialOwner) UpgradeableBeacon(implementation_, initialOwner) {
    
}
}

contract LeaseFactory{

mapping (uint256 => address) public leases;
LeaseBeacon public beacon;
constructor(address _vlogic){
    beacon = new LeaseBeacon(_vlogic, msg.sender);
}
function createLease(uint _value, uint _idLease)external returns(address){
       BeaconProxy proxy = new BeaconProxy(address(beacon), 
            abi.encodeWithSelector(LeaseV1(address(0)).initialize.selector,_value)
        );
        leases[_idLease] = address(proxy);
        return address(proxy);
}
 function getImplementation() public view returns (address) {
        return beacon.implementation();
    }
  function getBeacon() public view returns (address) {
        return address(beacon);
    }

     function getVault(uint256 x) public view returns (address) {
        return leases[x];
    }



}