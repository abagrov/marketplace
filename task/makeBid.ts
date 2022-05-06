import { parseEther } from "ethers/lib/utils";
import { task, types } from "hardhat/config";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";

task("makeBid", "Make a bid")
    .addParam("contractAddr", "Address of the deployed auction contract", "0xFc2B18a4e7134A8aE1d1D18CcF90988e532E7d48")
    .addParam("itemId", "Id of item to list", 0, types.int)
    .addParam("bidSum", "Sum to bid", "0.01", types.int)

    .setAction(async (taskArgs, hre) => {
        const marketplaceContract = await getContractAt(hre, "Marketplace", taskArgs['contractAddr']);

        const bidTransaction = await marketplaceContract.makeBid(taskArgs['itemId'], {value: parseEther(taskArgs['bidSum'])});
        const rc = await bidTransaction.wait();
        const listedEvent = rc!.events!.find((e: { event: string; }) => e.event == "BidMade");
        const [
            [topBidderSum, bidsNum, deadline, topBidder], 
          ]  = listedEvent!.args!;

        console.log(`Successfully bidded`)
    });