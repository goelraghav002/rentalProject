const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BoxModule", (m) => {
  const boxContract = m.contract("Box");

  return { boxContract };
});
