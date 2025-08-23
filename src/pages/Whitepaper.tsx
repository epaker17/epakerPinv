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
        `}
      </style>
      <div style={{ maxWidth: 850, margin: "0 auto" }}>
        <h1>PulseInvest (PINV) — Whitepaper</h1>

        <h2>Introduction</h2>
        <p>
          <b>PulseInvest (PINV)</b> is a modern ERC20 token deployed on the PulseChain network, created by an honest founder with a passion for developing the crypto ecosystem and supporting open, community-driven projects.
        </p>
        <p>
          PulseInvest is designed for simplicity, transparency, and sustainable growth. The project aims to engage users, involve the community in key decisions, and foster collaboration for future Web3 innovations.
        </p>

        <h2>Project Philosophy</h2>
        <ul>
          <li>
            <b>Honesty & Trust:</b> PulseInvest is developed by a reputable developer, and all code is available for the community to review. The project's growth will always consider the interests of users.
          </li>
          <li>
            <b>Sustainable Growth:</b> The long-term goal is to build a strong ecosystem with planned extensions, partnerships, and the launch of related projects and tools.
          </li>
          <li>
            <b>Community-Centric:</b> Major changes and updates will be consulted with the community. PulseInvest values open communication and collective decision-making.
          </li>
          <li>
            <b>Transparency:</b> All key steps, updates, and economic mechanisms are open-source and well-documented.
          </li>
        </ul>

        <h2>Tokenomics</h2>
        <ul>
          <li><b>Token name:</b> PulseInvest</li>
          <li><b>Symbol:</b> PINV</li>
          <li><b>Initial supply:</b> 21,000,000 PINV (minted at contract deployment)</li>
          <li><b>Treasury address:</b> A dedicated, immutable treasury address receives a portion of every transaction.</li>
          <li><b>Owner:</b> Managed by the deployer (Ownable), with no hidden functions or unfair advantages.</li>
        </ul>

        <h2>Key Features</h2>
        <h3>1. Simple, Deflationary Fee Mechanism</h3>
        <ul>
          <li>Every PINV token transfer is subject to a <b>fixed 4% fee</b>:</li>
          <li>2% is burned (permanently removed from circulation).</li>
          <li>2% goes directly to the treasury.</li>
        </ul>
        <p>Example: send 100 PINV → 2 burn, 2 treasury, recipient gets 96.</p>

        <h3>2. Security & Fair Architecture</h3>
        <ul>
          <li>ERC20 Standard, Ownable, immutable treasury, clear allowance errors.</li>
        </ul>

        <h2>Contract Summary</h2>
        <pre>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PulseInvest is ERC20, Ownable {
    address public immutable treasury;

    constructor(address _treasury)
        ERC20("PulseInvest", "PINV")
        Ownable(msg.sender)
    {
        require(_treasury != address(0), "Treasury cannot be zero address");
        treasury = _treasury;
        _mint(msg.sender, 21_000_000 * 10 ** decimals());
    }

    function _calculateFees(uint256 amount) internal pure returns (uint256 burn, uint256 treasuryAmount) {
        burn = (amount * 2) / 100;
        treasuryAmount = (amount * 2) / 100;
    }

    function transfer(address to, uint256 amount)
        public
        override
        returns (bool)
    {
        require(balanceOf(_msgSender()) >= amount, "ERC20: transfer amount exceeds balance");

        (uint256 burnAmt, uint256 treasuryAmt) = _calculateFees(amount);
        uint256 sendAmt = amount - burnAmt - treasuryAmt;

        _burn(_msgSender(), burnAmt);
        _transfer(_msgSender(), treasury, treasuryAmt);
        return super.transfer(to, sendAmt);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    )
        public
        override
        returns (bool)
    {
        uint256 current = allowance(from, _msgSender());
        require(current >= amount, "Allowance exceeded");
        _approve(from, _msgSender(), current - amount);

        require(balanceOf(from) >= amount, "ERC20: transfer amount exceeds balance");

        (uint256 burnAmt, uint256 treasuryAmt) = _calculateFees(amount);
        uint256 sendAmt = amount - burnAmt - treasuryAmt;

        _burn(from, burnAmt);
        _transfer(from, treasury, treasuryAmt);
        super._transfer(from, to, sendAmt);
        return true;
    }
}
`}</pre>

        <h2>Roadmap & Vision</h2>
        <ul>
          <li>Continuous development; community collaboration; ecosystem expansion; open to partnerships.</li>
        </ul>

        <h2>Disclaimer</h2>
        <p>
          PulseInvest is experimental. DYOR. Code is open-source; major changes will be consulted with the community.
        </p>

        <div style={{ textAlign: "center", marginTop: 40, fontWeight: 700 }}>
          Thank you for joining PulseInvest!
        </div>
      </div>
    </div>
  );
}
