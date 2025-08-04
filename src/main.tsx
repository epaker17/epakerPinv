// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultConfig
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import "./index.css";

const pulseTestnet = {
  id: 943,
  name: "PulseChain Testnet v4",
  nativeCurrency: {
    name: "Pulse",
    symbol: "tPLS",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.v4.testnet.pulsechain.com"] },
    public: { http: ["https://rpc.v4.testnet.pulsechain.com"] },
  },
  blockExplorers: {
    default: { name: "PulseScan", url: "https://scan.v4.testnet.pulsechain.com" },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "PulseInvest Dashboard",
  projectId: "pulse-dashboard",
  chains: [pulseTestnet],
  ssr: false,
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
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
