// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FOFCollection
 * @notice ERC-1155 NFT collection for Friends of Farcaster
 * @dev Uses OpenZeppelin's audited ERC1155 + Ownable contracts
 */
contract FOFCollection is ERC1155, Ownable {
    string public constant name = "Friends of Farcaster";
    string public constant symbol = "FOF";

    uint256 private _currentTokenId;
    mapping(uint256 => string) private _tokenURIs;

    event TokenMinted(
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI
    );

    constructor() ERC1155("") Ownable(msg.sender) {}

    /**
     * @notice Mint a new FOF NFT with IPFS metadata
     * @param to Recipient address
     * @param tokenURI IPFS URI for metadata (ipfs://...)
     * @return tokenId The ID of the minted token
     */
    function mint(
        address to,
        string calldata tokenURI
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = ++_currentTokenId;
        _tokenURIs[tokenId] = tokenURI;
        _mint(to, tokenId, 1, "");

        emit TokenMinted(to, tokenId, tokenURI);
        return tokenId;
    }

    /**
     * @notice Get the metadata URI for a token
     * @param tokenId The token ID to query
     * @return The IPFS URI for the token's metadata
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    /**
     * @notice Get the current token count
     * @return The total number of tokens minted
     */
    function totalMinted() public view returns (uint256) {
        return _currentTokenId;
    }
}
