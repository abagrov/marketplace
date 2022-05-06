import { task, types } from "hardhat/config";
import { parseEther } from "ethers/lib/utils";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";

task("finishAuction", "Finish the auction")
    .addParam("contractAddr", "Address of the deployed auction contract", "0xFc2B18a4e7134A8aE1d1D18CcF90988e532E7d48")
    .addParam("itemId", "Id of item to list", 0, types.int)

    .setAction(async (taskArgs, hre) => {
        const marketplaceContract = await getContractAt(hre, "Marketplace", taskArgs['contractAddr']);

        const finishTransaction = await marketplaceContract.finishAuction(taskArgs['itemId']);
        const rc = await finishTransaction.wait();
        const listedEvent = rc!.events!.find((e: { event: string; }) => e.event == "AuctionFinished");
        const [
            [topBidderSum, bidsNum, deadline, topBidder], 
            [itemId, tokenId, price, amount, itemOwner, itemProtocolType, isAvailable, isInAuction, name]
          ]  = listedEvent!.args!;

        console.log(`Successfully finished. New item owner: ${itemOwner}, top bidder: ${topBidder}, top bidder sum: ${topBidderSum}`)
    });