const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PulseInvest Integration", function () {
  let deployer, user, treasury;
  let PulseInvest, pulseInvest;

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners();
    treasury = deployer;
    PulseInvest = await ethers.getContractFactory("PulseInvest");
    pulseInvest = await PulseInvest.deploy(treasury.address);
    await pulseInvest.waitForDeployment();
    await pulseInvest.openTrading();
    for (let i = 0; i < 10; i++) {
      await ethers.provider.send("evm_mine");
    }
  });

  it("pozwala na transfer 0 tokenów i nie zmienia sald", async () => {
    const startBal = await pulseInvest.balanceOf(deployer.address);
    await expect(
      pulseInvest.transfer(user.address, 0)
    ).to.not.be.reverted;
    const endBal = await pulseInvest.balanceOf(deployer.address);
    expect(endBal).to.equal(startBal);
  });

  it("revertuje przy transferze na adres zero", async () => {
    await expect(
      pulseInvest.transfer(ethers.ZeroAddress, ethers.parseUnits("1", 18))
    ).to.be.reverted;
  });

  it("should have correct symbol", async () => {
    expect(await pulseInvest.symbol()).to.equal("PINV");
  });

  it("should set correct totalSupply and balances after deploy", async () => {
    const total = await pulseInvest.totalSupply();
    expect(ethers.formatUnits(total, 18)).to.equal("21000000.0");

    const balDeployer = await pulseInvest.balanceOf(deployer.address);
    expect(ethers.formatUnits(balDeployer, 18)).to.equal("21000000.0");
  });

  it("pozwala transferować do siebie, saldo spada o pełny fee", async () => {
    const amount = ethers.parseUnits("100", 18);
    const startBal = await pulseInvest.balanceOf(deployer.address);

    await pulseInvest.transfer(deployer.address, amount);

    const endBal = await pulseInvest.balanceOf(deployer.address);

    // Przy 100 PINV, fee = 2% burn + 2% treasury = 4 PINV
    expect(startBal - endBal).to.equal(ethers.parseUnits("2", 18));
  });

  it("revertuje transfer powyżej salda", async () => {
    const saldo = await pulseInvest.balanceOf(deployer.address);
    const over = saldo + ethers.parseUnits("1", 18);

    await expect(
      pulseInvest.transfer(user.address, over)
    ).to.be.reverted;
  });

  // --- TEST ANTY-BOT: sprawdza fee 99% na starcie ---
  it("przez pierwsze 10 bloków fee wynosi 99%, potem wraca do normy", async () => {
    // Deploy nowego kontraktu BEZ openTrading w beforeEach
    PulseInvest = await ethers.getContractFactory("PulseInvest");
    pulseInvest = await PulseInvest.deploy(deployer.address);
    await pulseInvest.waitForDeployment();

    const amount = ethers.parseUnits("1000", 18);

    // Otwieramy trading
    await pulseInvest.openTrading();

    // Transfer w anty-bot oknie (blok 0)
    const startBalDeployer = await pulseInvest.balanceOf(deployer.address);
    const startBalUser = await pulseInvest.balanceOf(user.address);

    await pulseInvest.transfer(user.address, amount);

    const balAfterDeployer = await pulseInvest.balanceOf(deployer.address);
    const balAfterUser = await pulseInvest.balanceOf(user.address);

    // 99% fee → user powinien dostać tylko 1% z 1000 = 10 PINV
    expect(ethers.formatUnits(balAfterUser, 18)).to.equal("10.0");

    // Przewiń 10 bloków
    for (let i = 0; i < 10; i++) {
      await ethers.provider.send("evm_mine");
    }

    // Transfer po anty-bot oknie
    const balBeforeAfter = await pulseInvest.balanceOf(user.address);
    await pulseInvest.transfer(user.address, ethers.parseUnits("100", 18));
    const balAfterAfter = await pulseInvest.balanceOf(user.address);

    // User powinien dostać >1 PINV (normalne fee)
    expect(balAfterAfter - balBeforeAfter).to.be.gt(ethers.parseUnits("1", 18));
  });

  // Testuje poprawny fee i allowance w transferFrom
  it("applies fees on transferFrom() and decreases allowance", async () => {
    await pulseInvest.approve(user.address, ethers.parseUnits("100", 18));
    await pulseInvest.connect(user).transferFrom(deployer.address, user.address, ethers.parseUnits("100", 18));
    const bal = await pulseInvest.balanceOf(user.address);
    expect(ethers.formatUnits(bal, 18)).to.equal("96.0");
    expect(await pulseInvest.allowance(deployer.address, user.address)).to.equal(0);
  });

  it("reverts transferFrom() if allowance is insufficient", async () => {
    await expect(
      pulseInvest.connect(user).transferFrom(deployer.address, user.address, ethers.parseUnits("1", 18))
    ).to.be.reverted;
  });

  // ------- DODANE BRANCH TESTS -------
  it("reverts transfer if trading is not open", async () => {
    PulseInvest = await ethers.getContractFactory("PulseInvest");
    pulseInvest = await PulseInvest.deploy(deployer.address);
    await pulseInvest.waitForDeployment();
    // Trading nieotwarty!
    await expect(
      pulseInvest.transfer(user.address, ethers.parseUnits("10", 18))
    ).to.be.revertedWith("Trading not open");
  });

  it("cannot openTrading twice", async () => {
    await expect(pulseInvest.openTrading()).to.be.revertedWith("Already opened");
  });

  // -------- BRANCH COVERAGE: test minimal value transfer (1 wei) --------
  it("allows transfer of minimal value, with no fee taken", async () => {
    const amount = 1n; // 1 wei
    const startBal = await pulseInvest.balanceOf(deployer.address);
    await pulseInvest.transfer(user.address, amount);
    const endBal = await pulseInvest.balanceOf(user.address);
    expect(endBal).to.equal(amount);
  });

});
