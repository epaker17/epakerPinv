import { Link, useLocation } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function InfoBar() {
  const loc = useLocation();
  const item = (to, label) => (
    <Link
      to={to}
      style={{
        color: "#FFD700",
        textDecoration: "none",
        padding: "8px 12px",
        borderRadius: 10,
        background: loc.pathname === to ? "#0e1a33" : "transparent",
        border: "1px solid #243056",
      }}
    >
      {label}
    </Link>
  );

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        background: "rgba(10,16,35,0.75)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid #243056",
      }}
    >
      {item("/", "Dashboard")}
      {item("/contract","Contract")} {item("/whitepaper", "Whitepaper")}
      <a
        href="https://scan.v4.testnet.pulsechain.com"
        target="_blank"
        rel="noreferrer"
        style={{ color: "#FFD700", padding: "8px 12px", borderRadius: 10, border: "1px solid #243056" }}
      >
        Explorer
      </a>
      <div style={{ marginLeft: 12 }}>
        <ConnectButton />
      </div>
    </div>
  );
}

