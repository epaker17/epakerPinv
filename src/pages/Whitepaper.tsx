export default function Whitepaper() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#14213d",
        color: "#FFD700",
        fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
        lineHeight: 1.8,
        fontSize: 18,
        padding: "48px 16px",
      }}
    >
      <style>
        {`
          a { color: #ffe066; text-decoration: underline; }
          a:hover { color: #fff16c; }
          h1, h2, h3, h4, h5 { color: #FFD700; margin-top: 2.2em; }
          ul { margin-left: 2em; }
          pre {
            background: #1b2541;
            color: #FFD700;
            border-radius: 14px;
            font-size: 14px;
            padding: 16px;
            margin-top: 16px;
            overflow-x: auto;
          }
          code { color: #ffe066; }
        `}
      </style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1>Pinv Token (PINV)  Whitepaper (2025 Update)</h1>

        <h2>Abstract</h2>
        <p>
          <b>Pinv Token (PINV)</b> is a simple and transparent ERC-20 token on PulseChain.
          Each transfer applies a fixed <b>4% fee</b>: <b>2%</b> is <b>burned</b> (deflationary)
          and <b>2%</b> is routed to the <b>treasury</b> to fund ecosystem growth.
          The design is community-first and intentionally easy to reason about for DeFi.
        </p>

        <h2>Vision & Values</h2>
        <ul>
          <li>
            <b>Built from passion:</b> created to support honest, transparent DeFi on PulseChain.
          </li>
          <li>
            <b>Simplicity & honesty:</b> no hidden functions, clear token economics, readable code.
          </li>
          <li>
            <b>Community-first:</b> future features and companion projects will be
            <b> consulted with the community</b> before rollout.
          </li>
        </ul>

        <h2>Token Parameters</h2>
        <ul>
          <li><b>Name:</b> Pinv</li>
          <li><b>Symbol:</b> PINV</li>
          <li><b>Standard:</b> ERC-20 (OpenZeppelin)</li>
          <li><b>Decimals:</b> 18</li>
          <li><b>Initial supply:</b> 21,000,000 PINV (minted at deployment)</li>
          <li><b>Treasury:</b> immutable address set in the constructor (receives 2% of every transfer)</li>
          <li><b>Ownership:</b> <code>Ownable</code>  used only for essentials; no obscure privileges.</li>
        </ul>

        <h2>Transfer Fee (4% Deflationary)</h2>
        <ul>
          <li><b>2%</b> of the amount is <b>burned</b> (permanently removed from supply).</li>
          <li><b>2%</b> goes to the <b>treasury</b>.</li>
          <li>The receiver gets <b>96%</b> of the sent amount.</li>
        </ul>
        <p>Example: send 100 PINV  <b>2</b> burn, <b>2</b> treasury, receiver gets <b>96</b>.</p>

        <h2>Treasury</h2>
        <p>
          Treasury funds may support liquidity, integrations, tooling, audits, education,
          and community rewards. Allocation principles and larger decisions will be
          <b> discussed with the community</b>.
        </p>

        <h2>Security & Architecture</h2>
        <ul>
          <li>Uses well-known <b>OpenZeppelin</b> libraries.</li>
          <li>No minting after deployment; <b>no blacklist</b>, <b>no pausing</b>.</li>
          <li>
            Custom error <code>AllowanceExceeded</code> improves clarity around
            <code> transferFrom</code> allowance checks.
          </li>
          <li>
            Note: some third-party contracts/bridges may not support <i>fee-on-transfer</i> tokens.
          </li>
        </ul>

        <h2>Contract (essentials)</h2>
        <pre>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Pinv with a fixed 4% fee (2% burn + 2% treasury)
contract Pinv is ERC20, Ownable {
    error AllowanceExceeded(address owner, address spender, uint256 requested, uint256 available);

    address public immutable treasury;

    constructor(address _treasury) ERC20("Pinv", "PINV") Ownable(msg.sender) {
        require(_treasury != address(0), "Treasury cannot be zero address");
        treasury = _treasury;
        _mint(msg.sender, 21_000_000 * 10 ** decimals());
    }

    /// Calculates 2% burn and 2% treasury (total 4%)
    function _calculateFees(uint256 amount) internal pure returns (uint256 burn, uint256 treasuryAmount) {
        burn = (amount * 2) / 100;
        treasuryAmount = (amount * 2) / 100;
    }

    /// transfer with 4% fee (2% burn + 2% treasury)
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(balanceOf(_msgSender()) >= amount, "ERC20: transfer amount exceeds balance");
        (uint256 burnAmt, uint256 treasuryAmt) = _calculateFees(amount);
        uint256 sendAmt = amount - burnAmt - treasuryAmt;
        _burn(_msgSender(), burnAmt);
        _transfer(_msgSender(), treasury, treasuryAmt);
        return super.transfer(to, sendAmt);
    }

    /// transferFrom with 4% fee (2% burn + 2% treasury) + custom error
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        uint256 current = allowance(from, _msgSender());
        if (current < amount) revert AllowanceExceeded(from, _msgSender(), amount, current);
        _approve(from, _msgSender(), current - amount);
        require(balanceOf(from) >= amount, "ERC20: transfer amount exceeds balance");
        (uint256 burnAmt, uint256 treasuryAmt) = _calculateFees(amount);
        uint256 sendAmt = amount - burnAmt - treasuryAmt;
        _burn(from, burnAmt);
        _transfer(from, treasury, treasuryAmt);
        super._transfer(from, to, sendAmt);
        return true;
    }
}`}</pre>

        <h2>Roadmap & Community Governance</h2>
        <ul>
          <li>DeFi integrations and tooling on PulseChain (analytics, alerts, UI).</li>
          <li>Companion projects cooperating with PINV and other honest tokens.</li>
          <li>Community programs: rewards, contests, education.</li>
          <li>Major changes announced and discussed with the community first.</li>
        </ul>

        <h2>Risks & Disclaimers</h2>
        <ul>
          <li>Crypto assets are high-risk  <b>DYOR</b> (Do Your Own Research).</li>
          <li>Fee-on-transfer behavior may affect some third-party contracts/bridges/DEXes.</li>
          <li>No profit promises. The project is transparent and community-first.</li>
        </ul>

        <div style={{ textAlign: "center", marginTop: 40, fontWeight: 700 }}>
          Thank you for building Pinv Token with us. 
        </div>
      </div>
    </div>
  );
}
