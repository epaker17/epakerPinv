// src/App.tsx
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Whitepaper from "./pages/Whitepaper";
import ContractInfo from "./pages/ContractInfo";
import InfoBar from "./components/InfoBar";

// fallback: jeśli nie ma pliku logo.jpeg, użyjemy /favicon.jpg
const _logos = import.meta.glob("./assets/logo.jpeg", { eager: true, as: "url" }) as Record<string, string>;
const logo = _logos["./assets/logo.jpeg"] ?? "/favicon.jpg";

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
