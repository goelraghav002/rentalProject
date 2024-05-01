const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LeaseFactoryModule", (m) => {
  const leaseFactoryContract= m.contract("LeaseFactory",["0x1c3C85Af3dd340aB6732e106845D5AEd70e5012b"] );

  return { leaseFactoryContract };
});