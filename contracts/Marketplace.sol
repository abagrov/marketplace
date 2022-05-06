//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "./Erc721.sol";
import "./Erc1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract Marketplace is ERC1155Holder {
    enum ContractType {
        ERC721,
        ERC1155
    }

    struct AuctionItem {
        uint256 topBidderSum;
        uint256 bidsNum;
        uint256 deadline;
        address payable topBidder;
    }

    struct MarketplaceItem {
        uint256 itemId;
        uint256 tokenId;
        uint256 price;
        uint256 amount;
        address payable owner;
        ContractType contractType;
        bool isAvailable;
        bool isInAuction;
        string name;
    }

    event ItemCreated(MarketplaceItem item);
    event ItemListed(MarketplaceItem item);
    event ItemUnlisted(MarketplaceItem item);
    event ItemBought(MarketplaceItem item, address indexed prevOwner);

    event AuctionCreated(AuctionItem auction, MarketplaceItem item);
    event BidMade(AuctionItem auction);
    event AuctionFinished(AuctionItem auction, MarketplaceItem item);
    event AuctionCanceled(AuctionItem auction, MarketplaceItem item);

    uint256 private itemCount;
    uint256 private auctionCount;

    Erc721 private erc721;
    Erc1155 private erc1155;

    mapping(uint256 => MarketplaceItem) private marketplaceItems;
    mapping(uint256 => AuctionItem) private auctions;

    constructor(address erc721Addr, address erc1155Addr) {
        erc721 = Erc721(erc721Addr);
        erc1155 = Erc1155(erc1155Addr);
    }

    function createItem(
        string memory itemMetadataUri,
        uint256 price,
        string memory name,
        ContractType contractType,
        uint256 amount
    ) public returns (uint256 itemId) {
        require(amount >= 1, "Invalid amount");

        itemId = itemCount;
        uint256 tokenId;

        if (contractType == ContractType.ERC721) {
            require(amount == 1, "Erc721 doesn't support amount");
            tokenId = erc721.mint(itemMetadataUri);
        } else {
            tokenId = erc1155.mint(amount, itemMetadataUri);
        }

        marketplaceItems[itemId] = MarketplaceItem(
            itemId,
            tokenId,
            price,
            amount,
            payable(msg.sender),
            contractType,
            false,
            false,
            name
        );
        itemCount++;
        emit ItemCreated(marketplaceItems[itemId]);
    }

    function listItem(uint256 itemId) public {
        require(
            marketplaceItems[itemId].owner == msg.sender,
            "Only owner can list item."
        );
        require(
            !marketplaceItems[itemId].isInAuction,
            "Item already is in auction."
        );

        marketplaceItems[itemId].isAvailable = true;
        emit ItemListed(marketplaceItems[itemId]);
    }

    function buyItem(uint256 itemId) public payable {
        MarketplaceItem memory item = marketplaceItems[itemId];

        require(item.isAvailable, "Item is unavailable.");
        require(msg.value >= item.price, "Invalid payment amount.");

        if (msg.value > item.price)
            payable(msg.sender).transfer(msg.value - item.price);

        item.owner.transfer(item.price);
        address prevOwner = item.owner;
        item.owner = payable(msg.sender);
        item.isAvailable = false;
        emit ItemBought(item, prevOwner);
    }

    function cancel(uint256 itemId) public {
        require(
            marketplaceItems[itemId].owner == msg.sender,
            "Only owner can do that."
        );
        marketplaceItems[itemId].isAvailable = false;
        emit ItemUnlisted(marketplaceItems[itemId]);
    }

    function listItemOnAuction(uint256 itemId) public {
        require(
            marketplaceItems[itemId].owner == msg.sender,
            "Only owner can do that."
        );
        require(
            !marketplaceItems[itemId].isInAuction,
            "Item already on auction."
        );

        marketplaceItems[itemId].isInAuction = true;
        marketplaceItems[itemId].isAvailable = false;

        auctions[itemId] = AuctionItem(
            0,
            0,
            block.timestamp + 3 days,
            payable(0)
        );
        emit AuctionCreated(auctions[itemId], marketplaceItems[itemId]);
    }

    function makeBid(uint256 itemId) public payable {
        require(
            marketplaceItems[itemId].isInAuction,
            "Auction already finished."
        );
        require(msg.value > auctions[itemId].topBidderSum, "Bid is too low.");

        address payable prevBidder = auctions[itemId].topBidder;
        uint256 prevBidderSum = auctions[itemId].topBidderSum;

        auctions[itemId].topBidder = payable(msg.sender);
        auctions[itemId].topBidderSum = msg.value;
        auctions[itemId].bidsNum++;

        if (prevBidder != address(0)) prevBidder.transfer(prevBidderSum);

        emit BidMade(auctions[itemId]);
    }

    function finishAuction(uint256 itemId) public {
        require(
            marketplaceItems[itemId].isInAuction,
            "Auction already finished."
        );
        require(
            marketplaceItems[itemId].owner == msg.sender,
            "Only owner can do that."
        );
        require(
            block.timestamp >= auctions[itemId].deadline,
            "Auction is not finished yet."
        );
        require(auctions[itemId].bidsNum >= 2, "Too low bidders.");

        address payable prevOwner = marketplaceItems[itemId].owner;

        marketplaceItems[itemId].isInAuction = false;
        marketplaceItems[itemId].owner = auctions[itemId].topBidder;

        prevOwner.transfer(auctions[itemId].topBidderSum);
        emit AuctionFinished(auctions[itemId], marketplaceItems[itemId]);
    }

    function cancelAuction(uint256 itemId) public {
        require(
            marketplaceItems[itemId].isInAuction,
            "Auction already finished."
        );
        require(
            marketplaceItems[itemId].owner == msg.sender,
            "Only owner can do that."
        );
        require(
            block.timestamp >= auctions[itemId].deadline,
            "Auction is not finished yet."
        );
        require(
            auctions[itemId].bidsNum < 2,
            "Too many bids to cancel auction."
        );

        marketplaceItems[itemId].isInAuction = false;

        if (auctions[itemId].bidsNum > 0)
            auctions[itemId].topBidder.transfer(auctions[itemId].topBidderSum);

        emit AuctionCanceled(auctions[itemId], marketplaceItems[itemId]);
    }
}
