// src/App.jsx
import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import Dashboard from "./pages/Dashboard";
import Whitepaper from "./pages/Whitepaper";
import InfoBar from "./components/InfoBar";
import { getReadContract } from "./lib/contract";

// Fallback na logo: jeśli brakuje src/assets/logo.jpeg, użyjemy /favicon.jpg
const modules = import.meta.glob("./assets/logo.jpeg", { eager: true, as: "url" });
const logo = modules["./assets/logo.jpeg"] ?? "/favicon.jpg";

// Twój dotychczasowy widok – teraz jako podstrona /contract
function ContractInfo() {
  const [name, setName] = useState("-");
  const [symbol, setSymbol] = useState("-");
  const [decimals, setDecimals] = useState(18);
  const [totalSupply, setTotalSupply] = useState("-");
  const [treasury, setTreasury] = useState("-");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const c = getReadContract();
        const [n, s, d, ts, tr] = await Promise.all([
          c.name(),
          c.symbol(),
          c.decimals(),
          c.totalSupply(),
          c.treasury(),
        ]);
        setName(n);
        setSymbol(s);
        const dn = Number(d);
        setDecimals(dn);
        setTotalSupply(ethers.formatUnits(ts, dn));
        setTreasury(tr);
      } catch (e) {
        setError(String(e?.message || e));
      }
    })();
  }, []);

  return (
    <div style={{ maxWidth: 760, margin: "40px auto", padding: 16, fontFamily: "Inter, system-ui" }}>
      <h1>PINV — Contract Info</h1>
      {error && <p style={{ color: "crimson" }}>Błąd: {error}</p>}
      <div style={{ display: "grid", gap: 8 }}>
        <div><b>Nazwa:</b> {name}</div>
        <div><b>Symbol:</b> {symbol}</div>
        <div><b>Decimals:</b> {decimals}</div>
        <div><b>Total supply:</b> {Number(totalSupply).toLocaleString()}</div>
        <div><b>Treasury:</b> {treasury}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          background: "linear-gradient(120deg,#14213d 0%,#1a2042 90%)",
        }}
      >
        <InfoBar />
        <div style={{ textAlign: "center", marginTop: 16, marginBottom: 32 }}>
          <img
            src={logo}
            alt="PINV logo"
            style={{ height: 220, borderRadius: 18, boxShadow: "0 6px 32px #0004" }}
          />
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contract" element={<ContractInfo />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
