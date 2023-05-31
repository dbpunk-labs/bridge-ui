import * as React from "react";
import * as ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import theme from "./theme";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  Chain,
  lightTheme,
} from "@rainbow-me/rainbowkit";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { scrollTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement!);

const localTestnet = {
  id: 1,
  name: "local Testnet",
  network: "local-testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
      webSocket: ["ws://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
      webSocket: ["ws://127.0.0.1:8545"],
    },
  },
  blockExplorers: {
    default: {
      name: "localhost",
      url: "http://127.0.0.1",
    },
  },
  testnet: true,
};

const { chains, publicClient } = configureChains(
  [scrollTestnet, localTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "DB3 Network Bridge",
  projectId: "DB3 Network",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

root.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({ borderRadius: "small" })}
      >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </ThemeProvider>
);
