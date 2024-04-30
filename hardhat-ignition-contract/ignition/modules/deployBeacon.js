const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LeaseBeaconModule", (m) => {
  const LeaseBeaconContract = m.contract("LeaseBeacon");

  return { LeaseBeaconContract };
});
