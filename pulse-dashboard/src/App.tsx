// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Whitepaper from "./pages/Whitepaper";
import logo from "./assets/logo.jpeg";
import InfoBar from "./components/InfoBar"; // <-- nowy komponent!

export default function App() {
  return (
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
          alt="PulseInvest logo"
          style={{
            height: 220,
            borderRadius: 18,
            boxShadow: "0 6px 32px #0004",
          }}
        />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
