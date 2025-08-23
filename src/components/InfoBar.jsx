// src/components/InfoBar.jsx
import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import pinvLogo from "../assets/logo.jpeg";

// Ustal explorer wg sieci z ENV
const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 943);
const EXPLORER =
  CHAIN_ID === 369
    ? "https://scan.pulsechain.com"
    : "https://scan.v4.testnet.pulsechain.com";

export default function InfoBar() {
  const loc = useLocation();

  const item = (to, label) => {
    const active = loc.pathname === to;
    return (
      <Link
        to={to}
        style={{
          color: "#FFD700",
          textDecoration: "none",
          padding: "8px 12px",
          borderRadius: 10,
          background: active ? "#0e1a33" : "transparent",
          border: "1px solid #243056",
          boxShadow: active ? "0 0 0 1px #2b3a66 inset" : "none",
          transition: "background .15s, box-shadow .15s",
          whiteSpace: "nowrap",
        }}
        aria-current={active ? "page" : undefined}
      >
        {label}
      </Link>
    );
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        padding: 10,
        background: "rgba(10,16,35,0.75)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid #243056",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {/* LEWO: logo + nazwa */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
          }}
        >
          <img
            src={pinvLogo}
            alt="PINV"
            style={{ height: 28, width: 28, borderRadius: 6, objectFit: "cover" }}
          />
          <span
            style={{
              color: "#FFD700",
              fontWeight: 700,
              letterSpacing: 0.4,
              userSelect: "none",
            }}
          >
            PINV
          </span>
        </div>

        {/* ŚRODEK: nawigacja */}
        <nav
          aria-label="Main"
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flex: 1,
            minWidth: 260,
          }}
        >
          {item("/", "Dashboard")}
          {item("/contract", "Contract")}
          {item("/whitepaper", "Whitepaper")}
          <a
            href={EXPLORER}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#FFD700",
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #243056",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Explorer
          </a>
        </nav>

        {/* PRAWO: Connect */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
