// src/components/TokenActions.jsx
const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 943);
const PINV_ADDRESS = import.meta.env.VITE_PINV_ADDRESS || "0xDddEB1b62F96e041333286D5F14470BDEbeAfBFD";
const EXPLORER =
  CHAIN_ID === 369
    ? "https://scan.pulsechain.com"
    : "https://scan.v4.testnet.pulsechain.com";

const wrap = {
  display: "flex",
  gap: 10,
  justifyContent: "center",
  flexWrap: "wrap",
  margin: "18px 0 10px 0",
};

const buttonStyle = {
  background: "#229ED9",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 14,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  transition: "0.15s",
  height: 36,
  boxShadow: "0 2px 10px #0002",
  textDecoration: "none",
};

export default function TokenActions() {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PINV_ADDRESS);
      alert("Copied: " + PINV_ADDRESS);
    } catch (e) {
      alert("Copy failed: " + (e?.message || e));
    }
  };

  const addToWallet = async () => {
    const eth = window.ethereum;
    if (!eth) return alert("Please install MetaMask or a compatible wallet.");
    try {
      await eth.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: PINV_ADDRESS,
            symbol: "PINV",
            decimals: 18,
            image: window.location.origin + "/favicon.jpg",
          },
        },
      });
    } catch (e) {
      alert("Could not add token: " + (e?.message || e));
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ color: "#7fd8ff", fontSize: 13, marginBottom: 6 }}>
        Contract: {PINV_ADDRESS}
      </div>
      <div style={wrap}>
        <button onClick={copy} style={buttonStyle}>Copy</button>
        <button onClick={addToWallet} style={buttonStyle}>Add to wallet</button>
        <a
          href={`${EXPLORER}/address/${PINV_ADDRESS}`}
          target="_blank"
          rel="noreferrer"
          style={buttonStyle}
        >
          Explorer
        </a>
      </div>
    </div>
  );
}
