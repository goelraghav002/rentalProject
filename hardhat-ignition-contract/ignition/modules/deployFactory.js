const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("LeaseFactoryModule", (m) => {
  const leaseFactoryContract= m.contract("LeaseFactory",[0x65E40C644Ee256cF4DDbC1DE51E93E48dDEC20d4] );

  return { leaseFactoryContract };
});