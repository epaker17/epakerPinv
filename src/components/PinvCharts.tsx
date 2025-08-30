import React from "react";

// HEX/WPLS pair on PulseChain / PulseX (DexScreener)
const PAIR_ID = "0x9b82fee4e54011fe7e5352317d6c7fdc5d2c1ace";
const EMBED_URL = `https://dexscreener.com/pulsechain/${PAIR_ID}?embed=1&theme=dark`;

export default function PinvCharts() {
  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "24px auto 0",
        padding: 16,
        border: "1px solid #243056",
        borderRadius: 12,
        background: "rgba(20,33,61,0.35)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#FFD700" }}>Charts</h3>

      <div
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          background: "#0b1226",
          border: "1px solid #243056",
        }}
      >
        <iframe
          title="HEX/WPLS — DexScreener"
          src={EMBED_URL}
          className="chart-frame"
          allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 12,
          color: "#FFD700",
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span>Powered by DexScreener</span>
        <a
          href={`https://dexscreener.com/pulsechain/${PAIR_ID}`}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "none" }}
        >
          <button
            style={{
              background: "#229ED9",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 12px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 10px #0002",
            }}
          >
            Open Pair
          </button>
        </a>
      </div>
    </div>
  );
}
