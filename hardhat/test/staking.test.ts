require("@nomicfoundation/hardhat-chai-matchers");
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { LepriconStaking, TestToken } from "../typechain-types";
import { duration, amounts, NFTtestAddress_BSC } from "./constant";
import { formatNumber, parseNumber } from "./utils";
import { BigNumber } from "ethers";

describe("LepriconStaking", function () {
  let testToken: TestToken,
    lepriconStaking: LepriconStaking,
    deployer: SignerWithAddress,
    user1: SignerWithAddress,
    user2: SignerWithAddress,
    user3: SignerWithAddress,
    admin: SignerWithAddress;

  // eslint-disable-next-line
  before(async function () {
    [deployer, user1, user2, user3, admin] = await ethers.getSigners();

    const TestToken = await ethers.getContractFactory("TestToken");
    testToken = await TestToken.deploy();
    await testToken.deployed();

    const LepriconStaking = await ethers.getContractFactory("LepriconStaking");
    lepriconStaking = await LepriconStaking.deploy(testToken.address);
    await lepriconStaking.deployed();
  });

  it("should stake 100 twice and emit events accordingly", async () => {
    let time_lock = 3;

    // Add some tokens to the staking contract, in order to pay the rewards
    await lepriconStaking.connect(deployer).setAdmin(admin.address);
    // expect(await lepriconStaking.admin()).to.equal(admin.address); // Switch admin to public in SC to check
    await testToken.transfer(admin.address, amounts.xxl);
    const balance = await testToken.balanceOf(admin.address);
    expect(balance).to.equal(formatNumber(100_000));

    await testToken
      .connect(admin)
      .approve(lepriconStaking.address, amounts.xxl);

    // Add 1000 tokens to user1 as well
    await testToken.transfer(user1.address, amounts.l);
    // Approve and stake
    await testToken
      .connect(deployer)
      .approve(lepriconStaking.address, amounts.l);
    const receipt = await lepriconStaking.stake(amounts.xs, time_lock);
    await expect(receipt)
      .to.emit(lepriconStaking, "Staked")
      .withArgs(deployer.address, amounts.xs, 1, anyValue, 7862400, anyValue);

    const receipt2 = await lepriconStaking.stake(amounts.xs, time_lock);
    await expect(receipt2)
      .to.emit(lepriconStaking, "Staked")
      .withArgs(deployer.address, amounts.xs, 1, anyValue, 7862400, anyValue);

    const contract_balance = await lepriconStaking.getTotalStaked();
    expect(parseNumber(contract_balance)).to.equal(200);
  });

  // 10000000000000000000000000
  // 100000000000000000000000

  it("should increase stakeholder's index with each new staker", async () => {
    let time_lock = 6;
    await testToken.connect(user1).approve(lepriconStaking.address, amounts.m);
    const receipt = await lepriconStaking
      .connect(user1)
      .stake(amounts.xs, time_lock);

    await expect(receipt)
      .to.emit(lepriconStaking, "Staked")
      .withArgs(user1.address, amounts.xs, 2, anyValue, 15724800, anyValue);

    const contract_balance = await lepriconStaking.getTotalStaked();
    expect(parseNumber(contract_balance)).to.equal(300);
  });

  it("shouldn't be possible to stake more than the amount of tokens owned", async () => {
    // Stake too much on user2
    const amountTooBig = amounts.l;

    await testToken.connect(user2).approve(lepriconStaking.address, amounts.xs);
    await expect(
      lepriconStaking.connect(user2).stake(amountTooBig, 12)
    ).to.be.revertedWith("Cannot stake more than you own");
  });

  it("shouldn't be possible to withdraw more than the current stake", async () => {
    // Allow to jump in the future... 91 days later
    await time.increase(duration.threeMonths);

    // Try withdrawing 200 from the first stake, which only contains 100
    await expect(
      lepriconStaking.connect(deployer).withdrawStake(amounts.s, 0)
    ).to.be.revertedWith("Can't withdraw more than staked");
  });

  it("should be possible to withdraw 50 from a 100 stake", async () => {
    const withdraw_amount = amounts.xxs;

    await time.increase(duration.threeMonths);

    // Try withdrawing 50 from first stake
    await lepriconStaking.connect(deployer).withdrawStake(withdraw_amount, 0);
    // Grab a new summary to see if the total has changed
    const summary = await lepriconStaking.hasStake(deployer.address);
    const initialBalance = amounts.s;

    expect(parseNumber(summary.total_amount)).to.equal(
      parseNumber(initialBalance) - parseNumber(withdraw_amount)
    );

    // Iterate through all stakes and check their amount as well.
    const staked = Number(summary.stakes[0].amount);
    expect(staked).to.equal(Number(amounts.xs) - Number(withdraw_amount));

    const contract_balance = await lepriconStaking.getTotalStaked();
    expect(Number(contract_balance)).to.equal(250 * 10 ** 18);
  });

  it("should remove a stake if empty", async () => {
    const withdraw_amount = amounts.xxs;
    await time.increase(duration.threeMonths);

    // Try withdrawing 50 from first stake AGAIN, this should empty the first stake
    await lepriconStaking.connect(deployer).withdrawStake(withdraw_amount, 0);

    // Grab a new summary to see if the total has changed
    const summary = await lepriconStaking.hasStake(deployer.address);
    expect(summary.stakes[0].user).to.equal(
      "0x0000000000000000000000000000000000000000"
    );

    const contract_balance = await lepriconStaking.getTotalStaked();
    expect(Number(contract_balance)).to.equal(200 * 10 ** 18);
  });

  it("should calculate the reward accordingly to APR and lockTime", async () => {
    // Owner has 1 stake at this time, its the index 1 with 100 Tokens staked
    // Lets fast forward time by 91 days and see if we gain 4% reward (0.0001096%/day)

    await time.increase(duration.threeMonths);
    let summary = await lepriconStaking.hasStake(deployer.address);
    let stake = summary.stakes[1];

    // 1 year has passed (364 days)
    expect(Number(stake.claimable)).to.equal(100 * 10 ** 18 * 0.0001096 * 364);

    // Make a new Stake for 1000, fast forward 91 days again, and make sure total stake reward is 9.68695 (0.0001096%/day for 15months)
    const newAmount = amounts.l;
    await testToken
      .connect(deployer)
      .approve(lepriconStaking.address, amounts.xl);
    await lepriconStaking.connect(deployer).stake(newAmount, 3);
    await time.increase(duration.threeMonths);

    // (We are now 15 months later than when the owner made his initial stake)
    summary = await lepriconStaking.hasStake(deployer.address);
    stake = summary.stakes[1];
    let newstake = summary.stakes[2];

    expect(Number(stake.claimable)).to.equal(100 * 10 ** 18 * 0.0001096 * 455);
    expect(Number(newstake.claimable)).to.equal(
      1000 * 10 ** 18 * 0.0001096 * 91
    );

    const contract_balance = await lepriconStaking.getTotalStaked();
    expect(Number(contract_balance)).to.equal(1200 * 10 ** 18);
  });

  it("should reward the stakes and transfer the tokens back to the user", async () => {
    // Use a fresh Account, transfer 1000 Tokens to it
    await testToken.connect(deployer).transfer(user3.address, amounts.l);
    await testToken.connect(user3).approve(lepriconStaking.address, amounts.l);

    // Make a stake on 200, fast forward 3 months (91days), claim reward, amount should be Initial balance + rewards
    await lepriconStaking.connect(user3).stake(amounts.s, 3);
    await time.increase(duration.threeMonths);

    const stakeSummary = await lepriconStaking.hasStake(user3.address);
    const stake = stakeSummary.stakes[0];
    // Withdraw 100 from stake at index 0
    await lepriconStaking.connect(user3).withdrawStake(amounts.xs, 0);

    // Balance of account holder should be updated with 100 tokens back + his rewards
    let after_balance = await testToken.balanceOf(user3.address);
    let reward = Number(stake.claimable);
    let expected = (1000 - 200 + 100) * 10 ** 18 + reward;

    expect(Number(after_balance)).to.equal(Number(expected));

    await lepriconStaking.connect(user3).withdrawStake(amounts.xs, 0);

    let second_balance = await testToken.balanceOf(user3.address);

    // We should have only gained 100 this time, there is no more rewards to claim for today!
    expect(Number(second_balance)).to.equal(
      Number(after_balance) + 100 * 10 ** 18
    );

    const contract_balance = await lepriconStaking.getTotalStaked();
    expect(Number(contract_balance)).to.equal(1200 * 10 ** 18);
  });

  it("should revert when setting NFT status", async () => {
    await expect(
      lepriconStaking
        .connect(user2)
        .setNftStatus(user2.address, NFTtestAddress_BSC, 2, 2)
    ).to.be.revertedWith("Not authorized");

    await expect(
      lepriconStaking
        .connect(deployer)
        .setNftStatus(user2.address, NFTtestAddress_BSC, 2, 25)
    ).to.be.revertedWith("Wrong boost amount");
  });

  it("should add an NFT booster and distribute reward accordingly", async () => {
    // Transfer 1000 Tokens to user2 and give approval
    await testToken.connect(deployer).transfer(user2.address, amounts.l);
    await testToken.connect(user2).approve(lepriconStaking.address, amounts.l);

    // Make a 200 with NFT boost, fast forward 6 months (182days), claim reward, amount should match APR + boost
    const stakeUser2 = amounts.s;

    await lepriconStaking
      .connect(deployer)
      .setNftStatus(user2.address, NFTtestAddress_BSC, 2, 2);
    await lepriconStaking.connect(user2).stake(amounts.xs, 0);
    await lepriconStaking.connect(user2).stake(stakeUser2, 6); // Test 6 months pool at the same time
    await lepriconStaking.connect(user2).stake(stakeUser2, 12); // Test 12 months pool at the same time

    const boostSummary = await lepriconStaking.boost(user2.address);
    expect(boostSummary.isBoost).to.equal(true);
    expect(Number(boostSummary.boostValue)).to.equal(2);

    await time.increase(duration.sixMonths);

    const stakeSummaryAfter = await lepriconStaking.hasStake(user2.address);
    const stakeNFT = stakeSummaryAfter.stakes[0];
    const stakeSixMonths = stakeSummaryAfter.stakes[1];
    // Reward should includes 2% NFT boost (2+2 = 4%)
    // limit to 3 decimals cause of rounded error
    expect(
      (parseInt(stakeNFT.claimable.toString()) / 10 ** 18).toFixed(5)
    ).to.equal(Number(100 * 0.0001096 * 182).toFixed(5));

    // 6 months lock shouldn't include the NFT boost (=6%)
    expect(Number(stakeSixMonths.claimable)).to.equal(
      200 * 0.0001644 * 182 * 10 ** 18
    );

    await lepriconStaking.connect(user2).withdrawStake(amounts.xs, 0);

    await expect(
      lepriconStaking.connect(user3).resetNftStatus(user2.address)
    ).to.be.revertedWith("Not authorized");

    await lepriconStaking.connect(user2).resetNftStatus(user2.address);

    const boostSummaryAfterReset = await lepriconStaking.boost(user2.address);
    expect(boostSummaryAfterReset.isBoost).to.equal(false);

    // Move forward 6 more months to check 12 months lock pool:
    await time.increase(duration.sixMonths);

    const stakeSummaryAfter12Months = await lepriconStaking.hasStake(
      user2.address
    );
    const stakeTwelveMonths = stakeSummaryAfter12Months.stakes[2];
    expect(
      (Number(stakeTwelveMonths.claimable) / 10 ** 18).toFixed(5)
    ).to.equal(Number(200 * 0.0002192 * 364).toFixed(5));
  });

  it("should edit the APR_NOLOCK successfully", async () => {
    const vault_noLock = await lepriconStaking.vaults(0);
    expect(vault_noLock.apr).to.equal(2);

    await expect(
      lepriconStaking.connect(user2).setAPR(1, 0)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await lepriconStaking.connect(deployer).setAPR(1, 0);
    const newAPR = await lepriconStaking.vaults(0);
    expect(newAPR.apr).to.equal(1);
  });

  it("should edit the APR_3MONTHS successfully", async () => {
    const vault_3months = await lepriconStaking.vaults(1);
    expect(vault_3months.apr).to.equal(4);

    await lepriconStaking.connect(deployer).setAPR(2, 3);
    const newAPR = await lepriconStaking.vaults(1);
    expect(newAPR.apr).to.equal(2);
  });

  it("should edit the APR_6MONTHS successfully", async () => {
    const vault_6months = await lepriconStaking.vaults(2);
    expect(vault_6months.apr).to.equal(6);

    await lepriconStaking.connect(deployer).setAPR(3, 6);
    const newAPR = await lepriconStaking.vaults(2);
    expect(newAPR.apr).to.equal(3);
  });

  it("should edit the APR_12MONTHS successfully", async () => {
    const vault_12months = await lepriconStaking.vaults(3);
    expect(vault_12months.apr).to.equal(8);

    await lepriconStaking.connect(deployer).setAPR(4, 12);
    const newAPR = await lepriconStaking.vaults(3);
    expect(newAPR.apr).to.equal(4);
  });
});
