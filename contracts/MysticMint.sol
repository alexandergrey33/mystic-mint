// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract MysticMint is SepoliaConfig {
    using FHE for *;
    
    struct Artwork {
        euint32 artworkId;
        euint32 complexity;
        euint32 colorVariation;
        euint8 patternType;
        ebool isRare;
        ebool isRevealed;
        string title;
        string metadataHash;
        address creator;
        uint256 mintTime;
        uint256 revealTime;
    }
    
    struct MintingParams {
        externalEuint32 complexity;
        externalEuint32 colorVariation;
        externalEuint8 patternType;
        bytes inputProof;
    }
    
    mapping(uint256 => Artwork) public artworks;
    mapping(address => uint256[]) public userArtworks;
    mapping(string => bool) public usedTitles;
    
    uint256 public artworkCounter;
    uint256 public mintPrice = 0.1 ether;
    address public owner;
    address public verifier;
    
    event ArtworkMinted(
        uint256 indexed artworkId,
        address indexed creator,
        string title,
        uint256 mintTime
    );
    
    event ArtworkRevealed(
        uint256 indexed artworkId,
        address indexed creator,
        uint256 revealTime
    );
    
    event RarityUpdated(
        uint256 indexed artworkId,
        bool isRare
    );
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function mintArtwork(
        string memory _title,
        MintingParams memory _params
    ) public payable returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(!usedTitles[_title], "Title already used");
        require(msg.value >= mintPrice, "Insufficient payment");
        
        uint256 artworkId = artworkCounter++;
        
        // Convert external encrypted values to internal
        euint32 internalComplexity = FHE.fromExternal(_params.complexity, _params.inputProof);
        euint32 internalColorVariation = FHE.fromExternal(_params.colorVariation, _params.inputProof);
        euint8 internalPatternType = FHE.fromExternal(_params.patternType, _params.inputProof);
        
        // Determine rarity based on encrypted parameters
        ebool isRare = FHE.or(
            FHE.gt(internalComplexity, FHE.asEuint32(80)),
            FHE.gt(internalColorVariation, FHE.asEuint32(90))
        );
        
        artworks[artworkId] = Artwork({
            artworkId: FHE.asEuint32(0), // Will be set properly later
            complexity: internalComplexity,
            colorVariation: internalColorVariation,
            patternType: internalPatternType,
            isRare: isRare,
            isRevealed: FHE.asEbool(false),
            title: _title,
            metadataHash: "",
            creator: msg.sender,
            mintTime: block.timestamp,
            revealTime: 0
        });
        
        userArtworks[msg.sender].push(artworkId);
        usedTitles[_title] = true;
        
        emit ArtworkMinted(artworkId, msg.sender, _title, block.timestamp);
        return artworkId;
    }
    
    function revealArtwork(
        uint256 _artworkId,
        string memory _metadataHash
    ) public {
        require(artworks[_artworkId].creator == msg.sender, "Only creator can reveal");
        require(artworks[_artworkId].revealTime == 0, "Already revealed");
        
        artworks[_artworkId].isRevealed = FHE.asEbool(true);
        artworks[_artworkId].revealTime = block.timestamp;
        artworks[_artworkId].metadataHash = _metadataHash;
        
        emit ArtworkRevealed(_artworkId, msg.sender, block.timestamp);
    }
    
    function updateRarity(
        uint256 _artworkId,
        ebool _isRare
    ) public {
        require(msg.sender == verifier, "Only verifier can update rarity");
        require(artworks[_artworkId].creator != address(0), "Artwork does not exist");
        
        artworks[_artworkId].isRare = _isRare;
        emit RarityUpdated(_artworkId, false); // Will be decrypted off-chain
    }
    
    function getArtworkInfo(uint256 _artworkId) public view returns (
        string memory title,
        string memory metadataHash,
        address creator,
        uint256 mintTime,
        uint256 revealTime,
        bool isRevealed
    ) {
        Artwork storage artwork = artworks[_artworkId];
        return (
            artwork.title,
            artwork.metadataHash,
            artwork.creator,
            artwork.mintTime,
            artwork.revealTime,
            false // FHE.decrypt(artwork.isRevealed) - will be decrypted off-chain
        );
    }
    
    function getUserArtworks(address _user) public view returns (uint256[] memory) {
        return userArtworks[_user];
    }
    
    function getArtworkCount() public view returns (uint256) {
        return artworkCounter;
    }
    
    function setMintPrice(uint256 _newPrice) public {
        require(msg.sender == owner, "Only owner can set price");
        mintPrice = _newPrice;
    }
    
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
    
    function setVerifier(address _newVerifier) public {
        require(msg.sender == owner, "Only owner can set verifier");
        verifier = _newVerifier;
    }
}
