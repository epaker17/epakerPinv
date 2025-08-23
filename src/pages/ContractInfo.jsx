import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getReadContract } from "../lib/contract";

export default function ContractInfo() {
  const [name,setName]=useState("-");
  const [symbol,setSymbol]=useState("-");
  const [decimals,setDecimals]=useState(18);
  const [totalSupply,setTotalSupply]=useState("-");
  const [treasury,setTreasury]=useState("-");
  const [error,setError]=useState("");

  useEffect(()=>{(async()=>{
    try{
      const c=getReadContract();
      const [n,s,d,ts,tr]=await Promise.all([
        c.name(), c.symbol(), c.decimals(), c.totalSupply(), c.treasury()
      ]);
      setName(n); setSymbol(s);
      const dn=Number(d); setDecimals(dn);
      setTotalSupply(ethers.formatUnits(ts,dn));
      setTreasury(tr);
    }catch(e){ setError(String(e?.message||e)); }
  })()},[]);

  return (
    <div style={{maxWidth:760,margin:"40px auto",padding:16,fontFamily:"Inter, system-ui"}}>
      <h1>PINV — Contract Info</h1>
      {error && <p style={{color:"crimson"}}>Błąd: {error}</p>}
      <div style={{display:"grid",gap:8}}>
        <div><b>Nazwa:</b> {name}</div>
        <div><b>Symbol:</b> {symbol}</div>
        <div><b>Decimals:</b> {decimals}</div>
        <div><b>Total supply:</b> {Number(totalSupply).toLocaleString()}</div>
        <div><b>Treasury:</b> {treasury}</div>
      </div>
    </div>
  );
}
