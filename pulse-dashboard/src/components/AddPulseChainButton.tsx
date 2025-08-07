// src/components/AddPulseChainButton.tsx
// Parametry PulseChain Mainnet
const PULSECHAIN_PARAMS = {
  chainId: "0x171", // 369 w hex
  chainName: "PulseChain",
  nativeCurrency: {
    name: "Pulse",
    symbol: "PLS",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.pulsechain.com"],
  blockExplorerUrls: ["https://scan.pulsechain.com"],
};

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

export default function AddPulseChainButton() {
  const addPulseChain = async () => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [PULSECHAIN_PARAMS],
        });
      } catch (error: any) {
        alert("Could not add PulseChain: " + (error?.message || error));
      }
    } else {
      alert("Please install MetaMask or a compatible wallet!");
    }
  };

  return (
    <button onClick={addPulseChain} style={buttonStyle}>
      Add PulseChain Mainnet
    </button>
  );
}
