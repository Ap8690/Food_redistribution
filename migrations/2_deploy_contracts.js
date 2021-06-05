const Food_redistribution = artifacts.require("Food_redistribution");

module.exports = function(deployer) {
    deployer.deploy(Food_redistribution);
  };