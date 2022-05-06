//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Erc1155 is ERC1155 {
    string public name = "Tectonic NFT 1155";
    string public symbol = "TNFT1155";
    uint256 public tokenCount;
    mapping(uint256 => string) private uris;

    constructor() ERC1155("") {}

    function mint(uint256 amount, string memory metadataUrl)
        public
        returns (uint256 tokenId)
    {
        tokenId = tokenCount;
        _mint(msg.sender, tokenId, amount, "");
        uris[tokenId] = metadataUrl;
        tokenCount++;
    }
}
