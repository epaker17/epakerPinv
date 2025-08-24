// src/components/PinvCharts.tsx
// HEX/WPLS (DexScreener) + duży mobilny widok + fullscreen

import { useState, useEffect } from "react";

const PAIR =
  (import.meta as any).env.VITE_HEX_PAIR ||
  "0xf1f4ee610b2babb05c635f726ef8b0c568c8dc65"; // domyślna para HEX/WPLS

const IFRAME_SRC = `https://dexscreener.com/pulsechain/${PAIR}?embed=1&info=0&theme=dark`;

export default function PinvCharts() {
  const [full, setFull] = useState(false);

  // zablokuj scroll strony w fullscreen
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = full ? "hidden" : prev || "";
    return () => { document.body.style.overflow = prev || ""; };
  }, [full]);

  return (
    <div
      className="chart-card tint-royal"
      style={{
        maxWidth: 1100,
        margin: "24px auto 0",
        padding: "24px",
        border: "1px solid #243056",
        borderRadius: 12,
        background: "rgba(20,33,61,0.35)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#61a5fb", textAlign: "center" }}>Charts</h3>

      <div
        className="chart-wrap chart-wrap--tint"
        style={{
          position: "relative",
          width: "100%",
          borderRadius: 12,
          overflow: "hidden",
          background: "#0b1327",
          boxShadow: "0 6px 24px #0004",
        }}
      >
        {/* Przycisk fullscreen (widoczny też na mobile) */}
        <button
          className="chart-full-btn"
          onClick={() => setFull(true)}
          aria-label="Open chart full screen"
          title="Fullscreen"
        >
          
        </button>

        <iframe
          title="HEX / WPLS  DexScreener"
          src={IFRAME_SRC}
          className="dex-embed"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          onError={(e: any) => {
            const box = e?.target?.parentElement;
            if (box) {
              box.innerHTML =
                `<div style="padding:24px;text-align:center;color:#FFD700">
                   Nie udało się wczytać wykresu.
                   <a href="${IFRAME_SRC.replace('?embed=1','')}" target="_blank" rel="noreferrer" style="color:#7fd8ff">
                     Otwórz na DexScreener
                   </a>.
                 </div>`;
            }
          }}
        />
      </div>

      <div style={{ textAlign: "right", marginTop: 8, fontSize: 12, color: "#7d8a95" }}>
        Źródło:&nbsp;
        <a
          href={IFRAME_SRC.replace("?embed=1", "")}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#7fd8ff" }}
        >
          DexScreener
        </a>
      </div>

      {/* Overlay fullscreen */}
      {full && (
        <div className="chart-fullscreen">
          <button
            className="chart-close-btn"
            onClick={() => setFull(false)}
            aria-label="Close chart"
            title="Close"
          >
            
          </button>
          <iframe
            title="HEX / WPLS  DexScreener (Fullscreen)"
            src={IFRAME_SRC}
            style={{
              position: "absolute",
              left: 0,
              top: 48,
              width: "100vw",
              height: "calc(100dvh - 48px)",
              border: 0,
            }}
          />
        </div>
      )}
    </div>
  );
}
