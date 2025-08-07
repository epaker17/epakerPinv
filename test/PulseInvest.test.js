const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PulseInvest token", function () {
  let PulseInvest, pulseInvest, owner, addr1, addr2;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    PulseInvest = await ethers.getContractFactory("PulseInvest");
    pulseInvest = await PulseInvest.deploy(owner.address);
    await pulseInvest.waitForDeployment();
    await pulseInvest.openTrading();  // <-- MUSI BYĆ!
    for (let i = 0; i < 10; i++) {
      await ethers.provider.send("evm_mine");
    }
  });

  it("mints initial supply to deployer", async function () {
    const bal = await pulseInvest.balanceOf(owner.address);
    expect(ethers.formatUnits(bal, 18)).to.equal("21000000.0");
  });

  it("sets treasury address correctly", async function () {
    expect(await pulseInvest.treasury()).to.equal(owner.address);
  });

  it("applies burn (2%) and treasury (2%) fees on transfer()", async function () {
    const amount = ethers.parseUnits("100", 18);
    await pulseInvest.connect(owner).transfer(addr1.address, amount);
    const bal1 = await pulseInvest.balanceOf(addr1.address);
    // 100 - 2 (burn) - 2 (treasury) = 96 PINV
    expect(ethers.formatUnits(bal1, 18)).to.equal("96.0");
  });

  it("applies fees on transferFrom() and decreases allowance", async function () {
    const amount = ethers.parseUnits("100", 18);
    await pulseInvest.connect(owner).approve(addr1.address, amount);
    await pulseInvest.connect(addr1).transferFrom(owner.address, addr2.address, amount);
    const bal2 = await pulseInvest.balanceOf(addr2.address);
    expect(ethers.formatUnits(bal2, 18)).to.equal("96.0");
  });

  it("reverts transferFrom() if allowance is insufficient", async function () {
    const amount = ethers.parseUnits("100", 18);
    // addr2 nie dostał approve, więc revert
    await expect(
      pulseInvest.connect(addr2).transferFrom(owner.address, addr1.address, amount)
    ).to.be.reverted;
  });

  // ------- DODANE BRANCH TESTS -------
  it("reverts transfer if trading is not open", async function () {
    PulseInvest = await ethers.getContractFactory("PulseInvest");
    pulseInvest = await PulseInvest.deploy(owner.address);
    await pulseInvest.waitForDeployment();
    // Trading nieotwarty!
    await expect(
      pulseInvest.transfer(addr1.address, ethers.parseUnits("10", 18))
    ).to.be.revertedWith("Trading not open");
  });

  it("cannot openTrading twice", async function () {
    await expect(pulseInvest.openTrading()).to.be.revertedWith("Already opened");
  });

  // -------- BRANCH COVERAGE: test minimal value transfer (1 wei) --------
  it("allows transfer of minimal value, with no fee taken", async function () {
    const amount = 1n; // 1 wei
    await pulseInvest.transfer(addr1.address, amount);
    expect(await pulseInvest.balanceOf(addr1.address)).to.equal(amount);
  });

});
