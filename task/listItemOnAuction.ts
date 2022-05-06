import { task, types } from "hardhat/config";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";

task("listItemOnAuction", "Lists item on the auction")
    .addParam("contractAddr", "Address of the deployed auction contract", "0xFc2B18a4e7134A8aE1d1D18CcF90988e532E7d48")
    .addParam("itemId", "Id of item to list", 0, types.int)

    .setAction(async (taskArgs, hre) => {
        const marketplaceContract = await getContractAt(hre, "Marketplace", taskArgs['contractAddr']);

        const listTransaction = await marketplaceContract.listItemOnAuction(taskArgs['itemId']);
        const rc = await listTransaction.wait();
        const listedEvent = rc!.events!.find((e: { event: string; }) => e.event == "AuctionCreated");
        const [
            [topBidderSum, bidsNum, deadline, topBidder], 
            [itemId, tokenId, price, amount, itemOwner, itemProtocolType, isAvailable, isInAuction, name]
          ]  = listedEvent!.args!;

        console.log(`Successfully listed. Is in auction: ${isInAuction}`)
    });