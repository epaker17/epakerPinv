import { useAccount, useDisconnect, useBalance, useReadContract } from "wagmi";
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// Uwaga: Link usunięty, użyjemy <a>, żeby nie wymagać Routera
import abi from "../abi/pinv-abi.json";
import BurnedStats from "../components/BurnedStats";
import AddPulseChainButton from "../components/AddPulseChainButton";
import PinvCharts from "../components/PinvCharts";
import TreasuryCard from "../components/TreasuryCard";
import BurnProgress from "../components/BurnProgress";
import TokenActions from "../components/TokenActions";
import BuyButtons from "../components/BuyButtons";

const SUPPORTED_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 943);
const PINV_ADDRESS = (import.meta.env.VITE_PINV_ADDRESS ||
  "0xDddEB1b62F96e041333286D5F14470BDEbeAfBFD") as `0x${string}`;

const buttonStyle: React.CSSProperties = {
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
  minWidth: 120,
  justifyContent: "center",
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // PLS balance (tylko gdy podłączony)
  const { data: plsData, isLoading: plsLoading } = useBalance({
    address,
    chainId: SUPPORTED_CHAIN_ID,
    query: { enabled: Boolean(address) },
  });

  // Decimals i symbol PINV
  const { data: decimals } = useReadContract({
    address: PINV_ADDRESS,
    abi: abi as any,
    functionName: "decimals",
    chainId: SUPPORTED_CHAIN_ID,
  });

  const { data: pinvSymbol } = useReadContract({
    address: PINV_ADDRESS,
    abi: abi as any,
    functionName: "symbol",
    chainId: SUPPORTED_CHAIN_ID,
  });

  // Balans PINV (tylko gdy mamy address)
  const { data: pinvRaw, isLoading: pinvLoading } = useReadContract({
    address: PINV_ADDRESS,
    abi: abi as any,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: SUPPORTED_CHAIN_ID,
    query: { enabled: Boolean(address) },
  });

  // Konwersja balansu PINV
  let pinvBalance = "0";
  try {
    if (typeof decimals === "number" && typeof pinvRaw !== "undefined" && pinvRaw !== null) {
      const raw =
        typeof pinvRaw === "bigint"
          ? pinvRaw
          : typeof pinvRaw === "string"
          ? BigInt(pinvRaw)
          : BigInt(0);
      const num = Number(raw) / 10 ** Number(decimals);
      pinvBalance = num.toLocaleString("pl-PL", { maximumFractionDigits: 4 });
    }
  } catch {
    // ignore formatting errors
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 12 }}>
      {/* Connect */}
      <div style={{ display: "flex", justifyContent: "center", margin: 24 }}>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </div>

      {/* Kafelek informacji o użytkowniku */}
      <div className="card" style={{ marginTop: 16, textAlign: "center" }}>
        <h2 style={{ color: "#61a5fb", marginTop: 0 }}>PINV Dashboard</h2>
        <div style={{ margin: "16px 0" }}>
          {isConnected ? (
            <>
              <div style={{ fontWeight: 500, color: "#fff" }}>
                <span style={{ color: "#7fd8ff" }}>Your address:</span>{" "}
                <span style={{ wordBreak: "break-all" }}>{address}</span>
              </div>
              <div style={{ margin: "14px 0 6px 0", color: "#a8f9f1" }}>
                <b>PLS:</b>{" "}
                {plsLoading ? "..." : plsData ? (Number(plsData.value) / 1e18).toLocaleString("pl-PL") : "0"}
              </div>
              <div style={{ margin: "8px 0", color: "#fff" }}>
                <b>{typeof pinvSymbol === "string" ? pinvSymbol : "PINV"}:</b>
                {pinvLoading ? " ..." : " " + pinvBalance}
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
                <button onClick={() => disconnect()} style={buttonStyle}>
                  Disconnect wallet
                </button>
              </div>
            </>
          ) : (
            <div style={{ color: "#229ED9" }}>Connect your wallet with RainbowKit to see balance!</div>
          )}
        </div>
      </div>

      {/* Akcje tokena (copy / add to wallet / explorer) */}
      <TokenActions />

      {/* Treasury + Burn */}
      <TreasuryCard />
      <BurnProgress />

      {/* Wykres HEX/WPLS */}
      <PinvCharts />

      {/* Social + Whitepaper + Add PulseChain Button */}
      <div
        className="social-buttons"
        style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}
      >
        <button onClick={() => window.open("https://x.com/PinvToken", "_blank")} style={buttonStyle}>
          <FaXTwitter size={18} />
          X / Twitter
        </button>
        <button onClick={() => window.open("https://t.me/PinvToken", "_blank")} style={buttonStyle}>
          <FaTelegramPlane size={18} />
          Telegram
        </button>
        <a href="/whitepaper" style={{ textDecoration: "none" }}>
          <button style={buttonStyle}>📄 Whitepaper</button>
        </a>
        <AddPulseChainButton />
      </div>

      {/* „Kup” / para */}
      <BuyButtons />

      {/* Copyright */}
      <div style={{ color: "#375486", textAlign: "center", marginTop: 16, fontSize: 13, fontWeight: 500 }}>
        PINV 2025 © All rights reserved.
      </div>
    </div>
  );
}
