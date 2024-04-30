const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LeaseV3Module", (m) => {
  const leaseV2Contract= m.contract("LeaseV2" );

  return { leaseV2Contract };
});