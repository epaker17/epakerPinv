// src/components/BurnProgress.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const RPC  = import.meta.env.VITE_RPC_URL || "https://rpc.v4.testnet.pulsechain.com";
const ADDR = (import.meta.env.VITE_PINV_ADDRESS || "").trim();
const INITIAL = 21_000_000;

const ABI = [
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)"
];

export default function BurnProgress(){
  const [data, setData] = useState({ burned:0, pct:"0.00" });

  useEffect(()=>{(async()=>{
    try{
      const provider = new ethers.JsonRpcProvider(RPC);
      const c = new ethers.Contract(ADDR, ABI, provider);
      const dec = await c.decimals();
      const total = await c.totalSupply();
      const totalF = Number(ethers.formatUnits(total, dec));
      const burned = Math.max(0, INITIAL - totalF);
      const pct = (burned / INITIAL) * 100;
      setData({ burned, pct: pct.toFixed(2) });
    }catch{}
  })()},[]);

  return (
    <div style={{
      maxWidth:1100, margin:"16px auto", padding:"16px 20px",
      border:"1px solid #243056", borderRadius:12, background:"rgba(20,33,61,0.35)", color:"#FFD700"
    }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:12,flexWrap:"wrap"}}>
        <div style={{fontWeight:700}}> Burned</div>
        <div style={{color:"#7d8a95",fontSize:13}}>{data.pct}% of supply</div>
      </div>
      <div style={{marginTop:10}}>
        <div style={{height:12, background:"#0b1327", borderRadius:8, overflow:"hidden"}}>
          <div style={{width:`${data.pct}%`, height:"100%", background:"#ffb703"}} />
        </div>
        <div style={{marginTop:6, fontWeight:600}}>
          {data.burned.toLocaleString("pl-PL", { maximumFractionDigits: 2 })} PINV
        </div>
      </div>
    </div>
  );
}
