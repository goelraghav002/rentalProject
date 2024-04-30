const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LeaseFactoryModule", (m) => {
  const leaseFactoryContract= m.contract("LeaseFactory",["0x8AD8a713bC720FB443330d99ce28aEB4d35Dd960"] );

  return { leaseFactoryContract };
});