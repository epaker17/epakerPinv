// Embed wykresu HEX/WPLS z DexScreener (PulseChain)
export default function PinvCharts() {
  return (
    <div
      style={{
        maxWidth: 900,
        margin: "24px auto 0",
        padding: "24px",
        border: "1px solid #243056",
        borderRadius: 12,
        background: "rgba(20,33,61,0.35)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#FFD700" }}>Charts</h3>

      <div className="chart-embed" style={{
        position: "relative",
        width: "100%",
        paddingBottom: "65%",
        overflow: "hidden",
        borderRadius: 12,
        border: "1px solid #243056",
        background: "rgba(10,16,35,0.4)"
      }}>
        <iframe
          src="https://dexscreener.com/pulsechain/0x75ec5cd01062502b6a1d1117bfa011c048f905d1?embed=1&theme=dark&trades=0&info=0"
          title="HEX / WPLS  DexScreener"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          allow="clipboard-write; fullscreen"
        />
      </div>

      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.95, color: "#FFD700" }}>
        Source: DexScreener {" "}
        <a
          href="https://dexscreener.com/pulsechain/0x75ec5cd01062502b6a1d1117bfa011c048f905d1"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#FFD700", textDecoration: "underline" }}
        >
          Open pair
        </a>
      </div>
    </div>
  );
}
