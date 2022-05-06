//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Erc721 is ERC721URIStorage {
    uint256 public tokenCount;

    constructor() ERC721("TectonicNFT", "TNFT") {
    }

    function mint(string memory tokenUrl) public returns (uint256 tokenId) {
        tokenId = tokenCount;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenUrl);
        tokenCount++;
    }
}
