// src/components/BuyButtons.jsx
const PAIR = import.meta.env.VITE_HEX_PAIR || "0xf1f4ee610b2babb05c635f726ef8b0c568c8dc65";
const PULSEX_PAIR_URL = `https://dexscreener.com/pulsechain/${PAIR}`;

export default function BuyButtons(){
  return (
    <div style={{maxWidth:1100, margin:"16px auto", display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap"}}>
      <a href={PULSEX_PAIR_URL} target="_blank" rel="noreferrer"
         style={{border:"1px solid #243056", background:"#0e1a33", color:"#FFD700", borderRadius:8, padding:"10px 16px", textDecoration:"none"}}>
         Otwórz parę (DexScreener)
      </a>
    </div>
  );
}
