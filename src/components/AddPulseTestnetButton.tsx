const PULSECHAIN_TESTNET = {
  chainId: "0x3AF", // 943 dec
  chainName: "PulseChain Testnet v4",
  nativeCurrency: { name: "Pulse", symbol: "tPLS", decimals: 18 },
  rpcUrls: ["https://rpc.v4.testnet.pulsechain.com"],
  blockExplorerUrls: ["https://scan.v4.testnet.pulsechain.com"],
} as const;

const btn: React.CSSProperties = {
  background: "#111b33",
  color: "#FFD700",
  border: "1px solid #243056",
  borderRadius: 8,
  padding: "8px 20px",
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 15,
  height: 38,
};

export default function AddPulseTestnetButton() {
  async function addOrSwitch() {
    const eth = (window as any)?.ethereum;
    if (!eth) return alert("MetaMask not found");
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: PULSECHAIN_TESTNET.chainId }] });
    } catch (e:any) {
      if (e?.code === 4902) {
        await eth.request({ method: "wallet_addEthereumChain", params: [PULSECHAIN_TESTNET] });
      } else {
        alert(e?.message || String(e));
      }
    }
  }
  return <button onClick={addOrSwitch} style={btn}>Add / Switch: Pulse Testnet v4</button>;
}
