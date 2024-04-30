//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";

contract LeaseContract is Initializable{
    struct Tenant {
        address id;
        uint256 startDate;
        uint256 endDate;
        uint256 monthlyRent;
        uint256 rentDue;
        uint256 lastRentPaidDate;
        uint256 advanceAmountPaid;
        uint256 securityDepositPaid;
        bool renewLease;
        bool renewLeaseOwner;
  
    }

    address private owner;

    Tenant private currentTenant;
    mapping(address => Tenant) private mapTenant;
    enum StateLeaseContract { available, rented, inactive }
    StateLeaseContract private leaseState;   
    uint256 public monthlyRent;
    uint256 public incrementRate;
    bool renewLease;
    function initialize(address _owner, uint _incrementRate, uint _monthlyRent)public initializer {
        owner = _owner;
        incrementRate=_incrementRate;
        leaseState=StateLeaseContract.available;
        monthlyRent=_monthlyRent;

        
    }
    
    modifier onlyOwner() {
         require(msg.sender == owner, "Only tenant can pay rent");
        _;}   
    modifier onlyCurrentTenant() {
        require(msg.sender==currentTenant.id, "Only current tenant can call this function");
        _;}
    modifier onlyOwnerOrCurrentTenant() {
        // Add owner or current tenant check logic here
      require(msg.sender == owner || msg.sender == currentTenant.id, "Only owner or current tenant can call this function");

        _;}
 
    modifier advancePaid() {
        // Add advance payment check logic here
        require(currentTenant.advanceAmountPaid==(2*currentTenant.monthlyRent), "Advance amount not paid");
        _; }
    
    modifier noRentDue() {
        // Add no rent due check logic here
        require(currentTenant.rentDue==0, "Rent is due");
        _;}
    modifier tenantAgree(){
            require(currentTenant.renewLease==true);
            _;}
    modifier ownerAgree(){
            require(currentTenant.renewLeaseOwner==true);
            _;}
    modifier isAvailable() {
    
        // Add lease contract Ava check logic here
        require(leaseState==StateLeaseContract.available, "Lease is not up for rent");
        _;}
    
 
    modifier isRented(){
        require(leaseState==StateLeaseContract.rented, "Lease is not rented");
        _;}
    modifier isInactive(){
        require(leaseState==StateLeaseContract.inactive, "Lease is not inactive");
        _;}


      

   modifier checkValue() {
        require(msg.value >=3*monthlyRent, "Not enough money");
        _;
    }
    modifier leaseEnded(){
        require(currentTenant.endDate<block.timestamp,"lease not ended");
        _;
    }
    event RentPaid(Tenant tenant , uint256 rent, uint256 lastRentPaidDate);
    event LeaseRenewed(Tenant tenant, uint256 rent, uint256 newLastDate);
    event StatusChanged(StateLeaseContract state);
    event OwnershipTransferred(address newOwner);
    event LeaseTerminated(Tenant tenant,address owner  ,uint256 endDate, uint256 securityDepositReturned);
    event DisputeHandled(Tenant tenant,address owner );
    event Message(string message);
    
   
    
   
   // set leasestate
    function setAvailable() public onlyOwner {leaseState=StateLeaseContract.available;}
    function setRented() public onlyOwner {leaseState=StateLeaseContract.rented;}
    function setInactive() public onlyOwner {leaseState= StateLeaseContract.inactive;}
    
    function payRent() public payable onlyCurrentTenant advancePaid noRentDue  {    
        // Add payRent function logic here
        require(msg.value>=monthlyRent,"rent amount not paid");
     if(msg.value >monthlyRent){
     uint rval=msg.value-monthlyRent;
      payable(msg.sender).transfer(rval);
     
     }
     //transfer money to owner
        leaseState=StateLeaseContract.rented;
    }
 
function rent()public payable isAvailable checkValue{

if(msg.value>3*monthlyRent){
    uint rval=msg.value-3*monthlyRent;
    payable(msg.sender).transfer(rval);
}
    mapTenant[msg.sender] =Tenant({
            id: msg.sender,
            startDate: block.timestamp,
            endDate: block.timestamp+365 days,  // Set end date to 0 for now
            monthlyRent:monthlyRent,
            rentDue: 0,
            lastRentPaidDate: block.timestamp,
            advanceAmountPaid: monthlyRent,  // Assuming no advance payment for now
            securityDepositPaid: 2*monthlyRent,  // Assuming no security deposit for now
            renewLease: false,  // Assuming lease renewal is not required for now
            renewLeaseOwner:false
        });
    currentTenant=mapTenant[msg.sender];

}


    function setRenewLeaseTenant(bool _decision) public view onlyCurrentTenant(){
     currentTenant.renewLease==_decision;

     }
   
    function setRenewLeaseOwner(bool _decision) public onlyOwner{
  currentTenant.renewLeaseOwner=_decision;
    }
    function RentRenewLease() public payable onlyCurrentTenant tenantAgree noRentDue ownerAgree leaseEnded(){ 
        currentTenant.endDate=block.timestamp+365 days;
        monthlyRent=monthlyRent+monthlyRent*incrementRate/100;
        require(msg.value>=3*monthlyRent,"not enough money");
        if(msg.value>3*monthlyRent){
        uint rval=msg.value-3*monthlyRent;
        payable(msg.sender).transfer(rval);
    }
                                                      
    }
   
    
    
    function terminateLease() public onlyOwnerOrCurrentTenant {
    bool wrongTermination;
    if (currentTenant.endDate > block.timestamp) {
        wrongTermination = true;
    } else {
        wrongTermination = false;
    }
    
    if (wrongTermination == true) {
        if (msg.sender == owner) {
            // Transfer security deposit to tenant 
            payable(currentTenant.id).transfer(currentTenant.securityDepositPaid);
            currentTenant.rentDue = 0;
            payable(currentTenant.id).transfer(currentTenant.advanceAmountPaid);
            emit Message("Owner terminated lease");
        } else {    
            // Transfer security deposit to owner 
            payable(owner).transfer(currentTenant.securityDepositPaid);
            emit Message("security deposit to owner");

            // Transfer advance to owner
            payable(owner).transfer(currentTenant.advanceAmountPaid);
            emit Message("advance to owner");
       emit Message("Tenant terminated lease");
        }
    } else {
        // Calculate fine and deduct from security deposit
        uint256 fine = calculateFine();
        uint256 amountToReturn = currentTenant.securityDepositPaid - fine;
        emit Message("security deposit to tenant");
        // Transfer security deposit - fine - rent due to tenant
        payable(currentTenant.id).transfer(amountToReturn);
        emit Message("advance to owner");
        currentTenant.rentDue = 0;
        // Transfer advance to owner
        payable(owner).transfer(currentTenant.advanceAmountPaid);
    }
    currentTenant.endDate = block.timestamp;

    leaseState=StateLeaseContract.inactive;
}

function calculateFine() private view  returns (uint) {
    
    
    
uint time = (currentTenant.lastRentPaidDate-block.timestamp);
uint desiredTime =30*24*60*60; 
if(time>desiredTime){
   
    uint fine =(time-desiredTime)*monthlyRent/100/24/60/60/30;
    return fine;
}
else{
    return 0;
}
}
    function transferOwnership(address newOwner) public onlyOwner {
        owner =newOwner;        }
 function getCurrentTenant() public view returns (Tenant memory) {
        return currentTenant;
    }
    
    // Additional function to retrieve the owner
    function getOwner() public view returns (address) {
        return owner;
    }

    function getTenant(address _id)public view returns(Tenant memory){
return mapTenant[_id];
    }
 
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
function createLease(uint _monthlyRent,uint _incrementRate, uint _idLease)external returns(address){
       BeaconProxy proxy = new BeaconProxy(address(beacon), 
            abi.encodeWithSelector(LeaseContract(address(0)).initialize.selector,msg.sender , _incrementRate,_monthlyRent)
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




