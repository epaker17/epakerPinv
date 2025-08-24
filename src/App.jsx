import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ContractInfo from "./pages/ContractInfo";
import Whitepaper from "./pages/Whitepaper";
import logo from "./assets/logo.jpeg";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        minWidth: "100vw",
        background: "linear-gradient(120deg,#14213d 0%,#1a2042 90%)",
      }}
    >
      {/* Prosty nagłówek z dużym logo */}
      <div style={{ textAlign: "center", paddingTop: 16, paddingBottom: 24 }}>
        <img src={logo} alt="PINV" className="hero-logo" />
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contract" element={<ContractInfo />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
