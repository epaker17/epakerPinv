const PULSECHAIN_MAINNET = {
  chainId: "0x171", // 369 dec
  chainName: "PulseChain",
  nativeCurrency: { name: "Pulse", symbol: "PLS", decimals: 18 },
  rpcUrls: ["https://rpc.pulsechain.com"],
  blockExplorerUrls: ["https://scan.pulsechain.com"],
} as const;

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
  async function addOrSwitch() {
    const eth = (window as any)?.ethereum;
    if (!eth) {
      alert("Please install MetaMask or a compatible wallet!");
      return;
    }
    try {
      // spróbuj przełączyć, jeśli już dodana
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: PULSECHAIN_MAINNET.chainId }],
      });
    } catch (e: any) {
      // 4902 = sieć nie dodana -> dodaj
      if (e?.code === 4902) {
        try {
          await eth.request({
            method: "wallet_addEthereumChain",
            params: [PULSECHAIN_MAINNET],
          });
        } catch (err: any) {
          alert("Could not add PulseChain: " + (err?.message || String(err)));
        }
      } else {
        alert(e?.message || String(e));
      }
    }
  }

  return (
    <button onClick={addOrSwitch} style={buttonStyle}>
      Add / Switch: PulseChain Mainnet
    </button>
  );
}
