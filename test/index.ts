import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, network } from "hardhat";

describe("marketplace test", function () {
  let marketplaceContract: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress;
  const testPrice = ethers.utils.parseEther("0.1");
  const testMetadataUri = "http://testMetadataUri.com";
  const testName = "Token";
  const item1Id = 0;
  const testBid1 = ethers.utils.parseEther("0.01");
  const testBid2 = ethers.utils.parseEther("0.03");
  const testBid3 = ethers.utils.parseEther("0.05");

  const threeDays = 60 * 60 * 24 * 3;
  const testErc1155Amount = 123;

  enum ProtocolType {
    ERC721 = 0,
    ERC1155 = 1
  }

  this.beforeEach(async () => {
    const factory721 = await ethers.getContractFactory("Erc721");
    const erc721Contract = await factory721.deploy();
    await erc721Contract.deployed();

    const factory1155 = await ethers.getContractFactory("Erc1155");
    const erc1155Contract = await factory1155.deploy();
    await erc1155Contract.deployed();

    const marketplace = await ethers.getContractFactory("Marketplace");
    marketplaceContract = await marketplace.deploy(erc721Contract.address, erc1155Contract.address);
    await marketplaceContract.deployed();
    [owner, user1, user2] = await ethers.getSigners();
  })

  it("Test marketplace ERC721 item creation", async () => {
    const createTransaction = await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    const rc = await createTransaction.wait();
    const itemCreatedEvent = rc.events.find((e: { event: string }) => e.event == "ItemCreated");
    const [[itemId, , price, amount, itemOwner, itemProtocolType, isAvailable, , name]] = itemCreatedEvent!.args;
    expect(itemId).to.equal(item1Id);
    expect(price).to.equal(testPrice);
    expect(amount).to.equal(1);
    expect(itemOwner).to.equal(owner.address);
    expect(itemProtocolType).to.equal(ProtocolType.ERC721);
    expect(isAvailable).to.equal(false);
    expect(name).to.equal(testName);

  });

  it("Test marketplace ERC1155 item creation", async () => {
    const createTransaction = await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC1155, testErc1155Amount);
    const rc = await createTransaction.wait();
    const itemCreatedEvent = rc.events.find((e: { event: string }) => e.event == "ItemCreated");
    const [[itemId, , price, amount, itemOwner, itemProtocolType, isAvailable, , name]] = itemCreatedEvent!.args;
    expect(itemId).to.equal(item1Id);
    expect(price).to.equal(testPrice);
    expect(amount).to.equal(testErc1155Amount);
    expect(itemOwner).to.equal(owner.address);
    expect(itemProtocolType).to.equal(ProtocolType.ERC1155);
    expect(isAvailable).to.equal(false);
    expect(name).to.equal(testName);

  });

  it("Check item listing", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    const listTransaction = await marketplaceContract.listItem(item1Id);
    const rc = await listTransaction.wait();
    const listedEvent = rc.events.find((e: { event: string }) => e.event == "ItemListed");
    const [[, , , , , , isAvailable,]] = listedEvent!.args;
    expect(isAvailable).to.equal(true);
  });

  it("Check that only owner can list a thing", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await expect(marketplaceContract.connect(user1).listItem(item1Id)).to.be.reverted;
  });

  it("Check item buying", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItem(item1Id);

    const initialOwnerBalance = await owner.getBalance();
    const initialUser1Balance = await user1.getBalance();

    const buyTransaction = await marketplaceContract.connect(user1).buyItem(item1Id, { value: testPrice });
    const rc = await buyTransaction.wait();

    const boughtEvent = rc.events.find((e: { event: string }) => e.event == 'ItemBought');

    const [[, , , , itemOwner, , isAvailable], prevOwner] = boughtEvent.args;
    expect(itemOwner).to.equal(user1.address);
    expect(prevOwner).to.equal(owner.address);
    expect(isAvailable).to.be.false;

    expect((await owner.getBalance()).gt(initialOwnerBalance));
    expect((await user1.getBalance()).lt(initialUser1Balance));
  });

  it("Check that user cant buy something by a lower price", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItem(item1Id);

    await expect(marketplaceContract.connect(user1).buyItem(item1Id, { value: testPrice.sub(1) })).to.be.reverted;
  });

  it("Check that user cant by an unlisted item", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.cancel(item1Id);

    await expect(marketplaceContract.connect(user1).buyItem(item1Id, { value: testPrice.sub(1) })).to.be.reverted;
  });

  it("Test item unlisting", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItem(item1Id);
    const unlistTransaction = await marketplaceContract.cancel(item1Id);

    const rc = await unlistTransaction.wait();
    const unlistedEvent = rc.events.find((e: { event: string }) => e.event == "ItemUnlisted");
    const [[, , , , , , isAvailable,]] = unlistedEvent!.args;
    expect(isAvailable).to.equal(false);
  });

  it("Check that only owner can unlist a thing", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await expect(marketplaceContract.connect(user1).cancel(item1Id)).to.be.reverted;
  });

  it("Check that it's impossible to double list item", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);
    await expect(marketplaceContract.listItemOnAuction(item1Id)).to.be.reverted;
  });

  it("Check that it's impossible to double list someone else's item", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await expect(marketplaceContract.connect(user1).listItemOnAuction(item1Id)).to.be.reverted;
  });

  it("Test bid creation", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    const initialUser1Balance = await user1.getBalance();

    const bidTransaction = await marketplaceContract.connect(user1).makeBid(item1Id, { value: testBid1 });
    const rc = await bidTransaction.wait();
    const bidEvent = rc.events.find((e: { event: string }) => e.event == "BidMade");

    const [[topBidderSum, bidsNum, , topBidder]] = bidEvent.args;
    expect(topBidder).to.equal(user1.address);
    expect(topBidderSum).to.equal(testBid1);
    expect(bidsNum).to.equal(bidsNum);

    const currentUser1Balance = await user1.getBalance();

    expect(currentUser1Balance.lt(initialUser1Balance.sub(testBid1))).to.be.true;
  });

  it("Test second bid creation", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    const initialUser1Balance = await user1.getBalance();
    const initialUser2Balance = await user2.getBalance();

    await marketplaceContract.connect(user1).makeBid(item1Id, { value: testBid1 });
    const bidTransaction = await marketplaceContract.connect(user2).makeBid(item1Id, { value: testBid2 });

    const rc = await bidTransaction.wait();
    const bidEvent = rc.events.find((e: { event: string }) => e.event == "BidMade");
    const [[topBidderSum, bidsNum, , topBidder]] = bidEvent.args;

    expect(topBidder).to.equal(user2.address);
    expect(topBidderSum).to.equal(testBid2);
    expect(bidsNum).to.equal(bidsNum);
    expect(initialUser1Balance.sub(await user1.getBalance()).lt(testBid1)).to.be.true;
    expect(initialUser2Balance.sub(await user2.getBalance()).gt(testBid1)).to.be.true;
  });

  it("Check that it's impossible to bid sum that less or equal the top sum", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    await marketplaceContract.connect(user1).makeBid(item1Id, { value: testBid1 });
    await expect(marketplaceContract.connect(user2).makeBid(item1Id, { value: testBid1 })).to.be.reverted;

  });

  it("Check that it's impossible to list a thing that's placed in auction", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    await expect(marketplaceContract.listItem(item1Id)).to.be.reverted;
  });

  it("Check that it's impossible to finish auction before deadline", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    await marketplaceContract.connect(user1).makeBid(item1Id, { value: testBid1 });
    await marketplaceContract.connect(user2).makeBid(item1Id, { value: testBid2 });

    await expect(marketplaceContract.finishAuction(item1Id)).to.be.reverted;
  });

  it("Check that it's impossible to finish auction if too few bids", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    await marketplaceContract.connect(user1).makeBid(item1Id, { value: testBid1 });
    await network.provider.send("evm_increaseTime", [threeDays]); 

    await expect(marketplaceContract.finishAuction(item1Id)).to.be.reverted;
  });

  it("Check that only owner can finish auction", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    await marketplaceContract.connect(user1).makeBid(item1Id, { value: testBid1 });
    await marketplaceContract.connect(user2).makeBid(item1Id, { value: testBid2 });

    await network.provider.send("evm_increaseTime", [threeDays]); 

    await expect(marketplaceContract.connect(user1).finishAuction(item1Id)).to.be.reverted;
  });

  it("Check that it's impossible to bid after finish", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    await marketplaceContract.connect(user1).makeBid(item1Id, { value: testBid1 });
    await marketplaceContract.connect(user2).makeBid(item1Id, { value: testBid2 });

    await network.provider.send("evm_increaseTime", [threeDays]); 

    await marketplaceContract.finishAuction(item1Id);

    await expect(marketplaceContract.connect(user1).makeBid(item1Id, { value: testBid3 })).to.be.reverted;
  });

  it("Check that it's impossible to double finish", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    await marketplaceContract.connect(user1).makeBid(item1Id, { value: testBid1 });
    await marketplaceContract.connect(user2).makeBid(item1Id, { value: testBid2 });

    await network.provider.send("evm_increaseTime", [threeDays]); 

    await marketplaceContract.finishAuction(item1Id);

    await expect(marketplaceContract.finishAuction(item1Id)).to.be.reverted;
  });


  it("Test auction finishing", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    const initialOwnerBalance = await owner.getBalance();

    await marketplaceContract.connect(user1).makeBid(item1Id, { value: testBid1 });
    await marketplaceContract.connect(user2).makeBid(item1Id, { value: testBid2 });

    await network.provider.send("evm_increaseTime", [threeDays]); 
    const finishTransaction = await marketplaceContract.finishAuction(item1Id);
    const rc = await finishTransaction.wait();
    const finishEvent = rc.events.find((e: { event: string }) => e.event == "AuctionFinished");

    const [
      [, ,],
      [, , , , itemOwner, , , isInAuction]
    ] = finishEvent.args;

    expect(itemOwner).to.equal(user2.address);
    expect(isInAuction).to.be.false;

    expect((await owner.getBalance()).gt(initialOwnerBalance)).to.be.true;

  });

  it("Check that it's impossible to cancel auction before deadline", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);
    await expect(marketplaceContract.cancelAuction(item1Id)).to.be.reverted;
  });

  it("Check that only owner can cancel auction", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    await network.provider.send("evm_increaseTime", [threeDays]); 

    await expect(marketplaceContract.connect(user1).cancelAuction(item1Id)).to.be.reverted;
  });

  it("Check that it's imposible to cancel auction if it already took place", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    await marketplaceContract.connect(user1).makeBid(item1Id, { value: testBid1 });
    await marketplaceContract.connect(user2).makeBid(item1Id, { value: testBid2 });

    await network.provider.send("evm_increaseTime", [threeDays]); 

    await expect(marketplaceContract.cancelAuction(item1Id)).to.be.reverted;
  });

  it("Check that it's impossible to double cancel", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    await network.provider.send("evm_increaseTime", [threeDays]); 

    await marketplaceContract.cancelAuction(item1Id);

    await expect(marketplaceContract.cancelAuction(item1Id)).to.be.reverted;
  });

  it("Test auction canceling if no bidders", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    await network.provider.send("evm_increaseTime", [threeDays]); 

    const finishTransaction = await marketplaceContract.cancelAuction(item1Id);
    const rc = await finishTransaction.wait();
    const finishEvent = rc.events.find((e: { event: string }) => e.event == "AuctionCanceled");

    const [
      [, ,],
      [, , , , itemOwner, , , isInAuction]
    ] = finishEvent.args;

    expect(isInAuction).to.be.false;
    expect(itemOwner).to.equal(owner.address);
  });

  it("Test auction canceling if one bidder", async () => {
    await marketplaceContract.createItem(testMetadataUri, testPrice, testName, ProtocolType.ERC721, 1);
    await marketplaceContract.listItemOnAuction(item1Id);

    await marketplaceContract.connect(user1).makeBid(item1Id, { value: testBid1 });

    const user1BalanceAfterBid = await user1.getBalance();

    await network.provider.send("evm_increaseTime", [threeDays]); 

    const finishTransaction = await marketplaceContract.cancelAuction(item1Id);
    const rc = await finishTransaction.wait();
    const finishEvent = rc.events.find((e: { event: string }) => e.event == "AuctionCanceled");

    const [
      [, ,],
      [, , , , itemOwner, , , isInAuction]
    ] = finishEvent.args;

    expect(isInAuction).to.be.false;
    expect(itemOwner).to.equal(owner.address);

    expect((await user1.getBalance()).eq(user1BalanceAfterBid.add(testBid1))).to.be.true;
  });
});
