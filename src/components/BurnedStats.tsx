import { useReadContract } from "wagmi";
import { ethers } from "ethers";
import abi from "../abi/pinv-abi.json";

const ADDRESS  = (import.meta.env.VITE_PINV_ADDRESS || "0x0000000000000000000000000000000000000000") as `0x${string}`;
const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 943);
const TREASURY = (import.meta.env.VITE_TREASURY_ADDRESS || "") as `0x${string}`;
const INITIAL_SUPPLY_TOKENS = "21000000"; // bez 18 zer

export default function BurnedStats() {
  // decimals + totalSupply
  const { data: decimals } = useReadContract({
    address: ADDRESS, abi: abi as any, functionName: "decimals", chainId: CHAIN_ID,
  });
  const { data: totalSupplyRaw } = useReadContract({
    address: ADDRESS, abi: abi as any, functionName: "totalSupply", chainId: CHAIN_ID,
  });

  // treasury balance (gdy ustawione)
  const hasTreasury = typeof TREASURY === "string" && TREASURY.startsWith("0x") && TREASURY.length === 42;
  const { data: treasuryBalRaw } = useReadContract({
    address: ADDRESS, abi: abi as any, functionName: "balanceOf",
    args: hasTreasury ? [TREASURY] : undefined, chainId: CHAIN_ID,
    query: { enabled: hasTreasury },
  });

  // obliczenia
  let burnedTokens = 0;
  let burnedPct = 0;
  let treasuryTokens = hasTreasury ? 0 : NaN;

  let burnedDisplay = "-";
  let burnedPctDisplay = "-";
  let treasuryDisplay = hasTreasury ? "-" : "—";

  try {
    if (typeof decimals === "number" && totalSupplyRaw != null) {
      const dn = Number(decimals);
      const initial = ethers.parseUnits(INITIAL_SUPPLY_TOKENS, dn);
      const ts = typeof totalSupplyRaw === "bigint" ? totalSupplyRaw : BigInt(String(totalSupplyRaw));
      const burned = initial > ts ? initial - ts : 0n;

      burnedTokens = Number(ethers.formatUnits(burned, dn));
      const initialTokens = Number(INITIAL_SUPPLY_TOKENS);
      burnedPct = initialTokens > 0 ? (burnedTokens / initialTokens) * 100 : 0;

      burnedDisplay = burnedTokens.toLocaleString("pl-PL", { maximumFractionDigits: 4 });
      burnedPctDisplay = burnedPct.toLocaleString("pl-PL", { maximumFractionDigits: 2 });

      if (hasTreasury && treasuryBalRaw != null) {
        const tb = typeof treasuryBalRaw === "bigint" ? treasuryBalRaw : BigInt(String(treasuryBalRaw));
        treasuryTokens = Number(ethers.formatUnits(tb, dn));
        treasuryDisplay = treasuryTokens.toLocaleString("pl-PL", { maximumFractionDigits: 4 });
      }
    }
  } catch {
    /* zostaw wartości domyślne */
  }

  const pct = Math.max(0, Math.min(100, burnedPct || 0));

  return (
    <div style={{
      maxWidth: 900, margin: "24px auto 0", padding: 16,
      border: "1px solid #243056", borderRadius: 12, background: "rgba(20,33,61,0.35)"
    }}>
      <div style={{display:"grid", gap: 12, gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))"}}>
        <Metric label="🔥 Burned (est.)" value={`${burnedDisplay} PINV`} />
        <Metric label="📊 Burned %" value={`${burnedPctDisplay}%`} />
        <Metric label="🏦 Treasury balance" value={treasuryDisplay === "-" ? "…" : `${treasuryDisplay} PINV`} />
      </div>

      {/* Progress bar */}
      <div style={{marginTop: 16}}>
        <div style={{fontSize:12,opacity:.8,marginBottom:6}}>Burn progress</div>
        <div style={{height:10, borderRadius:999, background:"#1b2541", overflow:"hidden", border:"1px solid #243056"}}>
          <div style={{
            width: `${pct}%`, height: "100%", background:"#FFD700",
            boxShadow: "0 0 12px #ffd700aa", transition: "width .4s ease"
          }} />
        </div>
      </div>
    </div>
  );
}

function Metric({label, value}: {label:string; value:string}) {
  return (
    <div style={{
      border:"1px solid #243056", borderRadius: 14, padding: 16,
      background: "rgba(20,33,61,0.25)"
    }}>
      <div style={{fontSize:12,opacity:.8,marginBottom:6}}>{label}</div>
      <div style={{fontWeight:700}}>{value}</div>
    </div>
  );
}
