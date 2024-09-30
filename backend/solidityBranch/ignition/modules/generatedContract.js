const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SoccerGameDeployment", (m) => {
  const soccerGame = m.contract("SoccerGame");

  return { soccerGame };
});