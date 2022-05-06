import { task, types } from "hardhat/config";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { parseEther } from "ethers/lib/utils";

task("buyItem", "Buy marketplace item")
    .addParam("contractAddr", "Address of the deployed auction contract", "0xFc2B18a4e7134A8aE1d1D18CcF90988e532E7d48")
    .addParam("itemId", "Id of item to list", 0, types.int)
    .addParam("price", "Price to pay", "0.001")

    .setAction(async (taskArgs, hre) => {
        const marketplaceContract = await getContractAt(hre, "Marketplace", taskArgs['contractAddr']);

        const buyTransaction = await marketplaceContract.buyItem(taskArgs['itemId'], {value: parseEther(taskArgs['price'])});
        const rc = await buyTransaction.wait();
    
        const boughtEvent = rc!.events!.find((e: { event: string; }) => e.event == 'ItemBought');
        
        const [[itemId, tokenId, price, amount, itemOwner, itemProtocolType, isAvailable, isInAuction, name], prevOwner] = boughtEvent!.args!;
    
        console.log(
            `Item successfully bought. Item id: ${itemId}, item price: ${price}, item name: "${name}", ` +
            `item owner: ${itemOwner}, is available for buying: ${isAvailable}, is in auction: ${isInAuction}`
        );
    });