import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// PulseChain mainnet & testnet
const pulseMainnet = {
  id: 369,
  name: "PulseChain",
  nativeCurrency: { name: "Pulse", symbol: "PLS", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.pulsechain.com"] },
    public: { http: ["https://rpc.pulsechain.com"] },
  },
  blockExplorers: {
    default: { name: "PulseScan", url: "https://scan.pulsechain.com" },
  },
  testnet: false,
};

const pulseTestnet = {
  id: 943,
  name: "PulseChain Testnet v4",
  nativeCurrency: { name: "Pulse", symbol: "tPLS", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.v4.testnet.pulsechain.com"] },
    public: { http: ["https://rpc.v4.testnet.pulsechain.com"] },
  },
  blockExplorers: {
    default: { name: "PulseScan", url: "https://scan.v4.testnet.pulsechain.com" },
  },
  testnet: true,
};

const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 943);
const chains = CHAIN_ID === 369 ? [pulseMainnet] : [pulseTestnet];

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
if (!projectId) {
  console.warn("Missing VITE_WALLETCONNECT_PROJECT_ID  WalletConnect may not work.");
}

const config = getDefaultConfig({
  appName: "PINV Dashboard",
  projectId,   // <-- wymagany przez WalletConnect v2
  chains,
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
