const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PulseInvest Integration", function () {
  let deployer, user, treasury;
  let PulseInvest, pulseInvest;

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners();
    treasury = deployer; // na lokalnym teście treasury = deployer
    PulseInvest = await ethers.getContractFactory("PulseInvest");
    // PODAJEMY TYLKO ADRES SKARBCa!
    pulseInvest = await PulseInvest.deploy(treasury.address);
    await pulseInvest.deployed();
  });

  it("should have correct symbol", async () => {
    expect(await pulseInvest.symbol()).to.equal("PINV");
  });

  it("should set correct totalSupply and balances after deploy", async () => {
    const total = await pulseInvest.totalSupply();
    expect(ethers.formatUnits(total, 18)).to.equal("21000000.0");

    const balDeployer = await pulseInvest.balanceOf(deployer.address);
    expect(ethers.formatUnits(balDeployer, 18)).to.equal("21000000.0");

    const balTreasury = await pulseInvest.balanceOf(treasury.address);
    expect(balTreasury).to.equal(balDeployer);
  });

  it("should transfer tokens between accounts (with fees)", async () => {
    // wysyłamy 100 PINV
    const gross = ethers.parseUnits("100.0", 18);
    // neto do usera = 95 PINV
    const net = ethers.parseUnits("95.0", 18);

    await expect(
      pulseInvest.connect(deployer).transfer(user.address, gross)
    )
      .to.emit(pulseInvest, "Transfer")
      .withArgs(deployer.address, user.address, net);

    // saldo usera
    const userBal = await pulseInvest.balanceOf(user.address);
    expect(ethers.formatUnits(userBal, 18)).to.equal("95.0");

    // saldo deployera = 21000000 - 100 = 20999900 minus burnt 2 => 20999800 minus treasury 3 => 20999700?
    // ale _transfer odejmuje wszystkie 100 PINV, więc saldo = 21000000 - 100 = 20999900
    const deployerBal = await pulseInvest.balanceOf(deployer.address);
    expect(ethers.formatUnits(deployerBal, 18)).to.equal("20999900.0");
  });

  it("should revert unauthorized burn", async () => {
    // burn może robić tylko właściciel (deployer), więc user powinien dostać revert
    await expect(
      pulseInvest.connect(user).burn(ethers.parseUnits("1", 18))
    ).to.be.reverted;
  });
});
