import React, { useState } from "react";

const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 943);
const ADDR = import.meta.env.VITE_PINV_ADDRESS || "0xDddEB1b62F96e041333286D5F14470BDEbeAfBFD";

const buttonStyle = {
  background: "#229ED9",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 20px",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 15,
  display: "flex",
  alignItems: "center",
  gap: 10,
  transition: "0.15s",
  height: 38,
  boxShadow: "0 2px 10px #0002",
  textDecoration: "none",
  minWidth: 140,
  justifyContent: "center",
};

export default function TokenActions() {
  const [copied, setCopied] = useState(false);
  const explorerBase = CHAIN_ID === 369 ? "https://scan.pulsechain.com" : "https://scan.v4.testnet.pulsechain.com";
  const explorerUrl = `${explorerBase}/address/${ADDR}`;

  const copyAddr = async () => {
    try {
      await navigator.clipboard.writeText(ADDR);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) { console.error(e); }
  };

  const addToWallet = async () => {
    const eth = window.ethereum;
    if (!eth) {
      alert("Please install MetaMask or a compatible wallet.");
      return;
    }
    try {
      await eth.request({
        method: "wallet_watchAsset",
        params: { type: "ERC20", options: { address: ADDR, symbol: "PINV", decimals: 18 } },
      });
    } catch (e) {
      console.error(e);
      alert(e && e.message ? e.message : String(e));
    }
  };

  return (
    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 16 }}>
      <button onClick={copyAddr} style={buttonStyle}>{copied ? "Copied " : "Copy"}</button>
      <button onClick={addToWallet} style={buttonStyle}>Add to wallet</button>
      <a href={explorerUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
        <button style={buttonStyle}>Explorer</button>
      </a>
    </div>
  );
}
