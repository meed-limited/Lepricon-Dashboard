// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Simple ERC20 Test Token
contract TestToken is ERC20 {
    constructor() ERC20("Test Token", "TEST") {
        _mint(msg.sender, 1e7 * (10 ** 18));
    }
}
