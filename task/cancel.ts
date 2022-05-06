import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { parseEther } from "ethers/lib/utils";
import { task, types } from "hardhat/config";

task("unlist", "Unlist item on the marketplace")
    .addParam("contractAddr", "Address of the deployed auction contract", "0xFc2B18a4e7134A8aE1d1D18CcF90988e532E7d48")
    .addParam("itemId", "Id of item to list", 0, types.int)

    .setAction(async (taskArgs, hre) => {
        const marketplaceContract = await getContractAt(hre, "Marketplace", taskArgs['contractAddr']);

        const listTransaction = await marketplaceContract.cancel(taskArgs['itemId']);
        const rc = await listTransaction.wait();
        const listedEvent = rc!.events!.find((e: { event: string; }) => e.event == "ItemUnlisted");
        const [[itemId, tokenId, price, amount, itemOwner, itemProtocolType, isAvailable, isInAuction, name]] = listedEvent!.args!;

        console.log(`Successfully unlisted. Is available for buying: ${isAvailable}`)
    });