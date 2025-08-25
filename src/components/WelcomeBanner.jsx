import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 943);
const EXPLORER =
  CHAIN_ID === 369
    ? "https://scan.pulsechain.com"
    : "https://scan.v4.testnet.pulsechain.com";

function shorten(addr) {
  return addr ? `${addr.slice(0, 6)}${addr.slice(-4)}` : "";
}

function btn(variant) {
  return {
    background: variant === "ghost" ? "transparent" : "#229ED9",
    color: variant === "ghost" ? "#FFD700" : "#fff",
    border: variant === "ghost" ? "1px solid #243056" : "none",
    borderRadius: 8,
    padding: "8px 14px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    height: 36,
    boxShadow: variant === "ghost" ? "none" : "0 2px 10px #0002",
  };
}

export default function WelcomeBanner() {
  const { address, isConnected } = useAccount();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("pinv_welcome_dismissed_v1");
      if (v === "1") setHidden(true);
    } catch {}
  }, []);

  const dismiss = () => {
    setHidden(true);
    try {
      localStorage.setItem("pinv_welcome_dismissed_v1", "1");
    } catch {}
  };

  if (hidden) return null;

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto 16px",
        padding: "12px 14px",
        border: "1px solid #243056",
        borderRadius: 12,
        background: "rgba(20,33,61,0.6)",
        color: "#FFD700",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        justifyContent: "space-between",
        boxShadow: "0 3px 18px #0002",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <span style={{ fontWeight: 700 }}>
          Welcome{isConnected ? `, ${shorten(address)}` : ""}!
        </span>
        <span style={{ opacity: 0.9 }}>
          This is the PINV dashboard. Connect your wallet to view balances and quick actions.
        </span>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a href="/whitepaper" style={{ textDecoration: "none" }}>
          <button style={btn()}>Read whitepaper</button>
        </a>
        <a href={EXPLORER} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
          <button style={btn()}>Explorer</button>
        </a>
        <button onClick={dismiss} aria-label="Dismiss" title="Dismiss" style={btn("ghost")}>
          
        </button>
      </div>
    </div>
  );
}
