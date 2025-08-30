import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider, http, fallback } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// --- PulseChain Testnet v4 ---
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

// --- RPC z .env (fallback) ---
const RPC1 = import.meta.env.VITE_RPC_URL || "https://rpc.v4.testnet.pulsechain.com";
const RPC2 = import.meta.env.VITE_RPC_URL_FALLBACK || RPC1;

const transports = {
  [pulseTestnet.id]: fallback([
    http(RPC1, { timeout: 20_000 }),
    http(RPC2, { timeout: 20_000 }),
  ]),
};

// --- WalletConnect Project ID (musi być ustawiony w .env / Vercel) ---
const PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "demo";

const config = getDefaultConfig({
  appName: "PINV Dashboard",
  projectId: PROJECT_ID,
  chains: [pulseTestnet],
  transports,
  ssr: false,
});

const queryClient = new QueryClient();

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
