//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    address payable public owner;
    uint256 public listPrice = 0.01 ether;

    struct ListedToken {
        uint256 tokenId;
        address payable owner;      // current owner
        address payable seller;     // who listed it
        address payable creator;    // original minter
        uint256 price;
        bool currentlyListed;
    }

    mapping(uint256 => ListedToken) private idToListedToken;

    event TokenListedSuccess(
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function updateListPrice(uint256 _listPrice) public {
        require(msg.sender == owner, "Only owner");
        listPrice = _listPrice;
    }

    /* ================================
               MINT & LIST
    ================================ */
    function createToken(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        require(price > 0, "Price must be > 0");
        require(msg.value == listPrice, "Send listing fee");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        idToListedToken[newTokenId] = ListedToken(
            newTokenId,
            payable(address(this)),   // marketplace holds it
            payable(msg.sender),      // seller
            payable(msg.sender),      // creator
            price,
            true
        );

        _transfer(msg.sender, address(this), newTokenId);

        emit TokenListedSuccess(
            newTokenId,
            address(this),
            msg.sender,
            price,
            true
        );

        return newTokenId;
    }

    /* ================================
               EXPLORE
    ================================ */
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint totalCount = _tokenIds.current();
        uint listedCount = 0;

        for (uint i = 1; i <= totalCount; i++) {
            if (idToListedToken[i].currentlyListed) {
                listedCount++;
            }
        }

        ListedToken[] memory items = new ListedToken[](listedCount);
        uint index = 0;

        for (uint i = 1; i <= totalCount; i++) {
            if (idToListedToken[i].currentlyListed) {
                items[index] = idToListedToken[i];
                index++;
            }
        }

        return items;
    }

    /* ================================
             MY COLLECTION
    ================================ */
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalCount = _tokenIds.current();
        uint count = 0;

        for (uint i = 1; i <= totalCount; i++) {
            if (idToListedToken[i].owner == msg.sender) {
                count++;
            }
        }

        ListedToken[] memory items = new ListedToken[](count);
        uint index = 0;

        for (uint i = 1; i <= totalCount; i++) {
            if (idToListedToken[i].owner == msg.sender) {
                items[index] = idToListedToken[i];
                index++;
            }
        }

        return items;
    }

    /* ================================
                 BUY
    ================================ */
    function executeSale(uint256 tokenId) public payable {
        ListedToken storage token = idToListedToken[tokenId];

        require(token.currentlyListed, "Not listed");
        require(msg.value == token.price, "Incorrect price");

        address payable seller = token.seller;

        token.currentlyListed = false;
        token.owner = payable(msg.sender);
        token.seller = payable(address(0));

        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);

        seller.transfer(msg.value);
    }
}
