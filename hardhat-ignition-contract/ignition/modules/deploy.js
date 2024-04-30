const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LeaseV4Module", (m) => {
  const leaseV4Contract= m.contract("LeaseV1" );

  return { leaseV4Contract };
});