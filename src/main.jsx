import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Z ENV (ustaw w .env oraz w Vercel)
const chainId = Number(import.meta.env.VITE_CHAIN_ID || 943);
const rpcUrl  = import.meta.env.VITE_RPC_URL || "https://rpc.v4.testnet.pulsechain.com";
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";

const pulseChain = {
  id: chainId,
  name: chainId === 943 ? "PulseChain Testnet v4" : chainId === 369 ? "PulseChain" : `Chain ${chainId}`,
  nativeCurrency: { name: chainId === 369 ? "Pulse" : "Pulse", symbol: chainId === 369 ? "PLS" : "tPLS", decimals: 18 },
  rpcUrls: { default: { http: [rpcUrl] }, public: { http: [rpcUrl] } },
  blockExplorers: {
    default: {
      name: "PulseScan",
      url: chainId === 943 ? "https://scan.v4.testnet.pulsechain.com" : "https://scan.pulsechain.com",
    },
  },
  testnet: chainId !== 369,
};

if (!projectId) {
  console.warn("Missing VITE_WALLETCONNECT_PROJECT_ID — WalletConnect może nie działać.");
}

const config = getDefaultConfig({
  appName: "PINV Dashboard",
  projectId,
  chains: [pulseChain],
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
