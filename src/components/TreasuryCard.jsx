// src/components/TreasuryCard.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const RPC  = import.meta.env.VITE_RPC_URL || "https://rpc.v4.testnet.pulsechain.com";
const ADDR = (import.meta.env.VITE_PINV_ADDRESS || "").trim();
const TREASURY = (import.meta.env.VITE_TREASURY_ADDRESS || "").trim();

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function symbol() view returns (string)"
];

export default function TreasuryCard(){
  const [state, setState] = useState({ sym:"PINV", dec:18, total:"0", bal:"0", pct:"0" });
  const [err, setErr] = useState("");

  useEffect(()=>{(async()=>{
    try{
      const provider = new ethers.JsonRpcProvider(RPC);
      const c = new ethers.Contract(ADDR, ERC20_ABI, provider);
      const [dec, sym, total, bal] = await Promise.all([
        c.decimals(), c.symbol(), c.totalSupply(), c.balanceOf(TREASURY)
      ]);
      const totalF = Number(ethers.formatUnits(total, dec));
      const balF   = Number(ethers.formatUnits(bal, dec));
      const pct    = totalF > 0 ? (balF/totalF*100) : 0;
      setState({ sym, dec, total: totalF.toLocaleString("pl-PL"), bal: balF.toLocaleString("pl-PL"), pct: pct.toFixed(2) });
    }catch(e){ setErr(String(e?.message||e)); }
  })()},[]);

  return (
    <div style={{
      maxWidth:1100, margin:"16px auto", padding:"18px 22px",
      border:"1px solid #243056", borderRadius:12, background:"rgba(20,33,61,0.35)",
      color:"#FFD700"
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{fontWeight:700}}>Treasury</div>
        <div style={{fontSize:13,color:"#7d8a95",wordBreak:"break-all"}}>{TREASURY}</div>
      </div>
      {err ? (
        <div style={{color:"#ff6b6b", marginTop:8}}>Błąd: {err}</div>
      ) : (
        <div style={{marginTop:8, display:"grid", gap:6}}>
          <div><b>Saldo:</b> {state.bal} {state.sym}</div>
          <div><b>Całkowita podaż:</b> {state.total} {state.sym}</div>
          <div>
            <b>Udział skarbca:</b> {state.pct}% 
            <div style={{height:10, background:"#0b1327", borderRadius:6, marginTop:6, overflow:"hidden"}}>
              <div style={{width:`${state.pct}%`, height:"100%", background:"#61a5fb"}} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
