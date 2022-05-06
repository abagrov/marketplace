import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";
import { parseEther } from "ethers/lib/utils";
import { task, types } from "hardhat/config";

enum ProtocolType {
    ERC721 = 0,
    ERC1155 = 1
}

task("createItem", "Creates new marketplace item")
    .addParam("contractAddr", "Address of the deployed auction contract", "0xFc2B18a4e7134A8aE1d1D18CcF90988e532E7d48")
    .addParam("itemMetadataUri", "Item metadata uri", "ipfs://QmbJRYqNMwmHHCqPKr1oj5DmVKixayTHe5vFRVj2k2fdEm")
    .addParam("price", "Price of item, eth", "0.001")
    .addParam("name", "Name of item", "Test item 1")
    .addParam("protocolType", "Type of nft protocol to be used. ERC721/ERC1155", "ERC721")
    .addParam("amount", "Amount of item", 1, types.int)

    .setAction(async (taskArgs, hre) => {

        const marketplaceContract = await getContractAt(hre, "Marketplace", taskArgs['contractAddr']);
        
        const ethPrice = parseEther(taskArgs['price']);
        const protocol = taskArgs['protocolType'] == "ERC721" ? ProtocolType.ERC721 : ProtocolType.ERC1155;

        const createTransaction = await marketplaceContract.createItem(
            taskArgs['itemMetadataUri'], 
            ethPrice, 
            taskArgs['name'], 
            protocol,
            taskArgs['amount']
        );
        
        const rc = await createTransaction.wait();
        const itemCreatedEvent = rc!.events!.find((e: { event: string; }) => e.event == "ItemCreated");
        const [[itemId, tokenId, price, amount, itemOwner, itemProtocolType, isAvailable, isInAuction, name]] = itemCreatedEvent!.args!;

        console.log(
            `Created new nft item. Item id: ${itemId}, amount: ${amount}, item price: ${price}, item name: "${name}", ` +
            `item owner: ${itemOwner}, item protocol type: ${ProtocolType[itemProtocolType]}, is available for buying: ${isAvailable}, is in auction: ${isInAuction}`
        );
    });