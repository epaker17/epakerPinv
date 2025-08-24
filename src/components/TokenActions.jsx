// src/components/TokenActions.jsx
const ADDR = (import.meta.env.VITE_PINV_ADDRESS || "").trim();
const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 943);
const EXPLORER = CHAIN_ID === 369 ? "https://scan.pulsechain.com" : "https://scan.v4.testnet.pulsechain.com";

function truncate(a){ return a ? a.slice(0,6)+""+a.slice(-4) : ""; }

export default function TokenActions(){
  const copy = async () => {
    try{ await navigator.clipboard.writeText(ADDR); alert("Skopiowano adres kontraktu"); }catch{}
  };
  const addToWallet = async () => {
    const w = window?.ethereum;
    if(!w) return alert("Zainstaluj MetaMask lub kompatybilny portfel");
    try{
      await w.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: { address: ADDR, symbol: "PINV", decimals: 18 }
        }
      });
    }catch(e){ alert(e?.message || e); }
  };

  return (
    <div style={{
      maxWidth:1100, margin:"16px auto", padding:"12px 16px",
      border:"1px solid #243056", borderRadius:12, background:"rgba(20,33,61,0.35)", color:"#FFD700",
      display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", justifyContent:"space-between"
    }}>
      <div style={{display:"flex",alignItems:"center",gap:8, minWidth:0}}>
        <span style={{fontWeight:700}}>Contract:</span>
        <span style={{wordBreak:"break-all"}}>{ADDR || "-"}</span>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button onClick={copy} style={{border:"1px solid #243056", background:"#0e1a33", color:"#FFD700", borderRadius:8, padding:"8px 12px"}}>Copy</button>
        <button onClick={addToWallet} style={{border:"1px solid #243056", background:"#0e1a33", color:"#FFD700", borderRadius:8, padding:"8px 12px"}}>Add to wallet</button>
        <a href={`${EXPLORER}/address/${ADDR}`} target="_blank" rel="noreferrer"
           style={{border:"1px solid #243056", background:"#0e1a33", color:"#FFD700", borderRadius:8, padding:"8px 12px", textDecoration:"none"}}>
          Explorer
        </a>
      </div>
    </div>
  );
}
