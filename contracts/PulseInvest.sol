// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title PulseInvest Token z 4% fee (2% burn, 2% treasury) + anty-bot okno 99% fee przez pierwsze 10 bloków od otwarcia handlu
contract PulseInvest is ERC20, Ownable {
    error AllowanceExceeded(address owner, address spender, uint256 requested, uint256 available);

    address public immutable treasury;

    // Anty-bot window
    uint256 public tradingOpenedBlock;
    bool public tradingOpened;
    uint256 public constant ANTIBOT_BLOCKS = 10;
    uint256 public constant ANTIBOT_FEE = 99; // 99% fee przez pierwsze 10 bloków

    event FeeTaken(address indexed from, uint256 burnAmount, uint256 treasuryAmount);

    modifier onlyWhenTradingOpen() {
        require(tradingOpened, "Trading not open");
        _;
    }

    constructor(address _treasury)
        ERC20("PulseInvest", "PINV")
        Ownable(msg.sender)
    {
        require(_treasury != address(0), "Treasury cannot be zero address");
        treasury = _treasury;
        _mint(msg.sender, 21_000_000 * 10 ** decimals());
    }

    /// @notice Otwiera trading – od tego bloku zaczyna się anty-bot window
    function openTrading() external onlyOwner {
        require(!tradingOpened, "Already opened");
        tradingOpened = true;
        tradingOpenedBlock = block.number;
    }

    /// @dev Zwraca fee: burn i treasury, zależnie od bloku (anty-bot lub normalne fee)
    function _calculateFees(uint256 amount) internal view returns (uint256 burn, uint256 treasuryAmount) {
        if (tradingOpened && block.number < tradingOpenedBlock + ANTIBOT_BLOCKS) {
            // 99% fee (anty-bot, wszystko do treasury)
            burn = 0;
            treasuryAmount = (amount * ANTIBOT_FEE) / 100;
        } else {
            // Normalnie: 2% burn, 2% treasury
            burn = (amount * 2) / 100;
            treasuryAmount = (amount * 2) / 100;
        }
    }

    /// @notice Transfer z fee (wymaga otwarcia tradingu)
    function transfer(address to, uint256 amount)
        public
        override
        onlyWhenTradingOpen
        returns (bool)
    {
        require(balanceOf(_msgSender()) >= amount, "ERC20: transfer amount exceeds balance");
        require(to != address(0), "ERC20: transfer to the zero address");

        (uint256 burnAmt, uint256 treasuryAmt) = _calculateFees(amount);
        uint256 sendAmt = amount - burnAmt - treasuryAmt;

        if (burnAmt > 0) {
            _burn(_msgSender(), burnAmt);
        }
        if (treasuryAmt > 0) {
            _transfer(_msgSender(), treasury, treasuryAmt);
        }
        _transfer(_msgSender(), to, sendAmt);

        emit FeeTaken(_msgSender(), burnAmt, treasuryAmt);

        return true;
    }

    /// @notice transferFrom z fee + custom error (wymaga otwarcia tradingu)
    function transferFrom(
        address from,
        address to,
        uint256 amount
    )
        public
        override
        onlyWhenTradingOpen
        returns (bool)
    {
        uint256 current = allowance(from, _msgSender());
        if (current < amount) {
            revert AllowanceExceeded(from, _msgSender(), amount, current);
        }
        _approve(from, _msgSender(), current - amount);

        require(balanceOf(from) >= amount, "ERC20: transfer amount exceeds balance");
        require(to != address(0), "ERC20: transfer to the zero address");

        (uint256 burnAmt, uint256 treasuryAmt) = _calculateFees(amount);
        uint256 sendAmt = amount - burnAmt - treasuryAmt;

        if (burnAmt > 0) {
            _burn(from, burnAmt);
        }
        if (treasuryAmt > 0) {
            _transfer(from, treasury, treasuryAmt);
        }
        _transfer(from, to, sendAmt);

        emit FeeTaken(from, burnAmt, treasuryAmt);

        return true;
    }
}
