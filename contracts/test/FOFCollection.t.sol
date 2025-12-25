// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/FOFCollection.sol";

contract FOFCollectionTest is Test {
    FOFCollection public collection;

    address public owner;
    address public user1;
    address public user2;

    string constant SAMPLE_URI_1 = "ipfs://QmTest123/metadata1.json";
    string constant SAMPLE_URI_2 = "ipfs://QmTest456/metadata2.json";
    string constant SAMPLE_URI_3 = "ipfs://QmTest789/metadata3.json";

    event TokenMinted(
        address indexed to,
        uint256 indexed tokenId,
        string tokenURI
    );
    event TransferSingle(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 id,
        uint256 value
    );

    function setUp() public {
        owner = address(this);
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        collection = new FOFCollection();
    }

    // ============================================
    // DEPLOYMENT TESTS
    // ============================================

    function test_Deployment_Name() public view {
        assertEq(collection.name(), "Friends of Farcaster");
    }

    function test_Deployment_Symbol() public view {
        assertEq(collection.symbol(), "FOF");
    }

    function test_Deployment_Owner() public view {
        assertEq(collection.owner(), owner);
    }

    function test_Deployment_TotalMinted() public view {
        assertEq(collection.totalMinted(), 0);
    }

    // ============================================
    // MINTING TESTS
    // ============================================

    function test_Mint_Success() public {
        uint256 tokenId = collection.mint(user1, SAMPLE_URI_1);

        assertEq(tokenId, 1);
        assertEq(collection.balanceOf(user1, 1), 1);
        assertEq(collection.uri(1), SAMPLE_URI_1);
        assertEq(collection.totalMinted(), 1);
    }

    function test_Mint_MultipleToDifferentUsers() public {
        uint256 tokenId1 = collection.mint(user1, SAMPLE_URI_1);
        uint256 tokenId2 = collection.mint(user2, SAMPLE_URI_2);
        uint256 tokenId3 = collection.mint(user1, SAMPLE_URI_3);

        assertEq(tokenId1, 1);
        assertEq(tokenId2, 2);
        assertEq(tokenId3, 3);

        assertEq(collection.balanceOf(user1, 1), 1);
        assertEq(collection.balanceOf(user2, 2), 1);
        assertEq(collection.balanceOf(user1, 3), 1);

        assertEq(collection.totalMinted(), 3);
    }

    function test_Mint_EmitsTokenMintedEvent() public {
        vm.expectEmit(true, true, false, true);
        emit TokenMinted(user1, 1, SAMPLE_URI_1);

        collection.mint(user1, SAMPLE_URI_1);
    }

    function test_Mint_EmitsTransferSingleEvent() public {
        vm.expectEmit(true, true, true, true);
        emit TransferSingle(owner, address(0), user1, 1, 1);

        collection.mint(user1, SAMPLE_URI_1);
    }

    function test_Mint_RevertIfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        collection.mint(user1, SAMPLE_URI_1);
    }

    function test_Mint_ToZeroAddress() public {
        // OpenZeppelin ERC1155 should revert on mint to zero address
        vm.expectRevert();
        collection.mint(address(0), SAMPLE_URI_1);
    }

    function test_Mint_EmptyURI() public {
        // Empty URI should still work (valid use case)
        uint256 tokenId = collection.mint(user1, "");
        assertEq(collection.uri(tokenId), "");
    }

    function test_Mint_LongURI() public {
        // Test with a very long URI
        string
            memory longUri = "ipfs://QmVeryLongHashThatMightCauseIssuesInSomeEdgeCasesButShouldStillWorkCorrectlyInMostCasesWithProperImplementation/metadata.json";
        uint256 tokenId = collection.mint(user1, longUri);
        assertEq(collection.uri(tokenId), longUri);
    }

    // ============================================
    // URI TESTS
    // ============================================

    function test_Uri_ReturnsCorrectURI() public {
        collection.mint(user1, SAMPLE_URI_1);
        collection.mint(user2, SAMPLE_URI_2);

        assertEq(collection.uri(1), SAMPLE_URI_1);
        assertEq(collection.uri(2), SAMPLE_URI_2);
    }

    function test_Uri_NonexistentToken() public view {
        // Should return empty string for non-existent token
        assertEq(collection.uri(999), "");
    }

    // ============================================
    // TRANSFER TESTS
    // ============================================

    function test_Transfer_SafeTransferFrom() public {
        collection.mint(user1, SAMPLE_URI_1);

        vm.prank(user1);
        collection.safeTransferFrom(user1, user2, 1, 1, "");

        assertEq(collection.balanceOf(user1, 1), 0);
        assertEq(collection.balanceOf(user2, 1), 1);
    }

    function test_Transfer_RevertIfNotOwnerOrApproved() public {
        collection.mint(user1, SAMPLE_URI_1);

        vm.prank(user2);
        vm.expectRevert();
        collection.safeTransferFrom(user1, user2, 1, 1, "");
    }

    function test_Transfer_WithApproval() public {
        collection.mint(user1, SAMPLE_URI_1);

        vm.prank(user1);
        collection.setApprovalForAll(user2, true);

        vm.prank(user2);
        collection.safeTransferFrom(user1, user2, 1, 1, "");

        assertEq(collection.balanceOf(user2, 1), 1);
    }

    // ============================================
    // OWNERSHIP TESTS
    // ============================================

    function test_TransferOwnership() public {
        collection.transferOwnership(user1);
        assertEq(collection.owner(), user1);
    }

    function test_TransferOwnership_RevertIfNotOwner() public {
        vm.prank(user1);
        vm.expectRevert();
        collection.transferOwnership(user2);
    }

    function test_RenounceOwnership() public {
        collection.renounceOwnership();
        assertEq(collection.owner(), address(0));
    }

    function test_Mint_RevertAfterOwnershipRenounced() public {
        collection.renounceOwnership();

        vm.expectRevert();
        collection.mint(user1, SAMPLE_URI_1);
    }

    // ============================================
    // FUZZ TESTS
    // ============================================

    function testFuzz_Mint(address to, string calldata uri_) public {
        // Exclude zero address and contract addresses (which may not implement ERC1155Receiver)
        vm.assume(to != address(0));
        vm.assume(to.code.length == 0); // Only EOAs, not contracts

        uint256 tokenId = collection.mint(to, uri_);

        assertEq(collection.balanceOf(to, tokenId), 1);
        assertEq(collection.uri(tokenId), uri_);
    }

    function testFuzz_MintMultiple(uint8 count) public {
        vm.assume(count > 0 && count <= 100);

        for (uint8 i = 0; i < count; i++) {
            collection.mint(user1, SAMPLE_URI_1);
        }

        assertEq(collection.totalMinted(), count);
    }

    // ============================================
    // GAS TESTS
    // ============================================

    function test_Gas_Mint() public {
        uint256 gasBefore = gasleft();
        collection.mint(user1, SAMPLE_URI_1);
        uint256 gasAfter = gasleft();

        uint256 gasUsed = gasBefore - gasAfter;

        // Log gas usage for reference
        console.log("Gas used for mint:", gasUsed);

        // Assert reasonable gas usage (should be under 150k)
        assertLt(gasUsed, 150000);
    }
}
