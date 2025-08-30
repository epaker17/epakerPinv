import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http, fallback } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const pulseTestnet = {
  id: 943,
  name: "PulseChain Testnet v4",
  nativeCurrency: { name: "Pulse", symbol: "tPLS", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.v4.testnet.pulsechain.com"] },
    public:  { http: ["https://rpc.v4.testnet.pulsechain.com"] },
  },
  blockExplorers: {
    default: { name: "PulseScan", url: "https://scan.v4.testnet.pulsechain.com" },
  },
  testnet: true,
};

const RPC1 = import.meta.env.VITE_RPC_URL || "https://rpc.v4.testnet.pulsechain.com";
const RPC2 = import.meta.env.VITE_RPC_URL_FALLBACK || RPC1;

const transports = {
  [pulseTestnet.id]: fallback([http(RPC1,{timeout:20_000}), http(RPC2,{timeout:20_000})]),
};

const PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const queryClient = new QueryClient();

function MissingConfig() {
  const box = {
    maxWidth: 760, margin: "40px auto", padding: 16,
    background: "rgba(20,33,61,.6)", border: "1px solid #243056",
    borderRadius: 12, color: "#FFD700", fontFamily: "system-ui"
  };
  const code = {background:"#111a33", padding:"2px 6px", borderRadius:6, border:"1px solid #243056"};
  return (
    <div style={box}>
      <h2 style={{marginTop:0}}>PINV Dashboard</h2>
      <div style={{color:"#ffdf6b"}}>Missing <span style={code}>VITE_WALLETCONNECT_PROJECT_ID</span>.</div>
      <div style={{opacity:.85, marginTop:6}}>
        Set it in Vercel  Settings  Environment Variables, then redeploy.
      </div>
    </div>
  );
}

if (!PROJECT_ID || PROJECT_ID.toLowerCase() === "demo") {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode><MissingConfig /></React.StrictMode>
  );
} else {
  const config = getDefaultConfig({
    appName: "PINV Dashboard",
    projectId: PROJECT_ID,
    chains: [pulseTestnet],
    transports,
    ssr: false,
  });

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
}
