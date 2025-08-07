import { useState, useEffect } from "react";

const COINGECKO_IDS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "ripple", symbol: "XRP" },
  { id: "solana", symbol: "SOL" }
];

const DEXSCREENER_PAIRS = [
  {
    symbol: "HEX",
    url: "https://api.dexscreener.com/latest/dex/tokens/0x2b591e99afe9f32eaa6214f7b7629768c40eeb39"
  },
  {
    symbol: "PLS",
    url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0x08d1161271e8d4b1f6e7c8dc1fbe6a1b35b46c43"
  },
  {
    symbol: "PLSX",
    url: "https://api.dexscreener.com/latest/dex/pairs/pulsechain/0xa74c2b08c6a7b8ba84e3b03fcb76be2f7d549fe6"
  }
];

type PriceMap = { [symbol: string]: string };

export default function InfoBar() {
  const [prices, setPrices] = useState<PriceMap>({
    BTC: "...", ETH: "...", XRP: "...", SOL: "...", HEX: "...", PLS: "...", PLSX: "..."
  });

  // CoinGecko
  useEffect(() => {
    async function fetchCoinGecko() {
      const ids = COINGECKO_IDS.map(c => c.id).join(",");
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        const result: PriceMap = {};
        COINGECKO_IDS.forEach(c => {
          result[c.symbol] = data[c.id]?.usd
            ? "$" + Number(data[c.id].usd).toLocaleString("en-US", { maximumFractionDigits: 4 })
            : "N/A";
        });
        setPrices(prev => ({ ...prev, ...result }));
      } catch {
        // ignore
      }
    }
    fetchCoinGecko();
  }, []);

  // Dexscreener
  useEffect(() => {
    async function fetchDexscreener() {
      for (const { symbol, url } of DEXSCREENER_PAIRS) {
        try {
          const res = await fetch(url);
          const data = await res.json();
          let price: string = "N/A";
          if (symbol === "HEX") {
            if (Array.isArray(data.pairs) && data.pairs.length > 0) {
              const sorted = data.pairs
                .filter((p: any) => p.priceUsd)
                .sort((a: any, b: any) => Number(b.volume) - Number(a.volume));
              if (sorted.length > 0 && sorted[0].priceUsd) {
                price = "$" + Number(sorted[0].priceUsd).toLocaleString("en-US", { maximumFractionDigits: 6 });
              }
            }
          } else {
            if (data.pair && data.pair.priceUsd) {
              price = "$" + Number(data.pair.priceUsd).toLocaleString("en-US", { maximumFractionDigits: 6 });
            }
          }
          setPrices(prev => ({ ...prev, [symbol]: price }));
        } catch {
          setPrices(prev => ({ ...prev, [symbol]: "N/A" }));
        }
      }
    }
    fetchDexscreener();
    const interval = setInterval(fetchDexscreener, 120000);
    return () => clearInterval(interval);
  }, []);

  const tickerLine =
    `BTC: ${prices.BTC} | ETH: ${prices.ETH} | XRP: ${prices.XRP} | SOL: ${prices.SOL} | HEX: ${prices.HEX} | PLS: ${prices.PLS} | PLSX: ${prices.PLSX}`;

  return (
    <div style={{
      background: "#101C2B",
      color: "#ffd000ee",
      padding: "8px 0",
      fontWeight: 700,
      fontSize: 19,
      overflow: "hidden",
      letterSpacing: 1,
      width: "100%",
      borderBottom: "2px solid #fddb18ff",
      boxShadow: "0 4px 12px #0003"
    }}>
      <div
        style={{
          whiteSpace: "nowrap",
          display: "inline-block",
          animation: "tickerLoop 22s linear infinite",
          minWidth: "100%",
        }}
      >
        {tickerLine}
      </div>
      <style>{`
        @keyframes tickerLoop {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
