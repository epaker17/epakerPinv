import { useAccount, useDisconnect, useBalance, useReadContract } from "wagmi"; 
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import PinvCharts from "../components/PinvCharts";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import PINV_ABI from "../abi/PINV.json";
import { Link } from "react-router-dom";
import BurnedStats from "../components/BurnedStats";
import AddPulseChainButton from "../components/AddPulseChainButton";

const SUPPORTED_CHAIN_ID = 943;
const PINV_ADDRESS = "0x49a43585aCc15bDb503EC2833a426CCa154bE8e8";

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
  justifyContent: "center"
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Balans PLS
  const { data: plsData, isLoading: plsLoading } = useBalance({
    address,
    chainId: SUPPORTED_CHAIN_ID,
  });

  // PINV decimals
  const { data: decimals } = useReadContract({
    address: PINV_ADDRESS,
    abi: PINV_ABI,
    functionName: "decimals",
    chainId: SUPPORTED_CHAIN_ID,
  });

  // PINV symbol
  const { data: pinvSymbol } = useReadContract({
    address: PINV_ADDRESS,
    abi: PINV_ABI,
    functionName: "symbol",
    chainId: SUPPORTED_CHAIN_ID,
  });

  // PINV balance (dla użytkownika)
  const { data: pinvRaw, isLoading: pinvLoading } = useReadContract({
    address: PINV_ADDRESS,
    abi: PINV_ABI,
    functionName: "balanceOf",
    args: address ? [address] : [],
    chainId: SUPPORTED_CHAIN_ID,
  });

  // Konwersja balansu PINV
  let pinvBalance = "0";
  if (
    typeof decimals === "number" &&
    typeof pinvRaw !== "undefined" &&
    pinvRaw !== null
  ) {
    try {
      const raw =
        typeof pinvRaw === "bigint"
          ? pinvRaw
          : typeof pinvRaw === "string"
          ? BigInt(pinvRaw)
          : BigInt(0);

      pinvBalance = (Number(raw) / 10 ** Number(decimals)).toLocaleString("pl-PL", {
        maximumFractionDigits: 4,
      });
    } catch {
      pinvBalance = "0";
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", margin: 32 }}>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </div>

      <div className="card" style={{ marginTop: 32, textAlign: "center" }}>
        <h2 style={{ color: "#61a5fb" }}>PulseInvest Dashboard</h2>
        <div style={{ margin: "24px 0" }}>
          {isConnected ? (
            <>
              <div style={{ fontWeight: 500, color: "#fff" }}>
                <span style={{ color: "#7fd8ff" }}>Your address:</span>{" "}
                <span style={{ wordBreak: "break-all" }}>{address}</span>
              </div>
              <div style={{ margin: "18px 0 6px 0", color: "#a8f9f1" }}>
                <b>PLS:</b>{" "}
                {plsLoading
                  ? "..."
                  : plsData
                  ? (Number(plsData.value) / 1e18).toLocaleString("pl-PL")
                  : "0"}
              </div>
              <div style={{ margin: "8px 0", color: "#fff" }}>
                <b>
                  {typeof pinvSymbol === "string" ? pinvSymbol : "PINV"}:
                  {pinvLoading ? "..." : " " + pinvBalance}
                </b>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                <button onClick={() => disconnect()} style={buttonStyle}>
                  Disconnect wallet
                </button>
              </div>
            </>
          ) : (
            <div style={{ color: "#229ED9" }}>
              Connect your wallet with RainbowKit to see balance!
            </div>
          )}
        </div>
      </div>

      {/* Burned PINV stats */}
      <BurnedStats />

      {/* Wykres cen tokenów */}
      <PinvCharts />

      {/* Social + Whitepaper + Add PulseChain Button */}
      <div className="social-buttons" style={{
        display: "flex",
        gap: 12, // idealny gap!
        justifyContent: "center",
        marginTop: 32,
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => window.open("https://x.com/PinvToken", "_blank")}
          style={buttonStyle}
        >
          <FaXTwitter size={18} />
          X / Twitter
        </button>
        <button
          onClick={() => window.open("https://t.me/PinvToken", "_blank")}
          style={buttonStyle}
        >
          <FaTelegramPlane size={18} />
          Telegram
        </button>
        <Link to="/whitepaper" style={{ textDecoration: "none" }}>
          <button style={buttonStyle}>
            📄 Whitepaper
          </button>
        </Link>
        {/* Dodany przycisk Add PulseChain */}
        <AddPulseChainButton />
      </div>

      {/* Copyright */}
      <div
        style={{
          color: "#375486",
          textAlign: "center",
          marginTop: 20,
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        PulseInvest 2025 &copy; All rights reserved.
      </div>
    </div>
  );
}
