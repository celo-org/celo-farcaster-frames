import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { http, WagmiProvider, createConfig } from "wagmi";
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';
import { celo, celoAlfajores } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "";
if (!projectId) {
  console.warn("WalletConnect Project ID is needed");
}

// Create the wagmi config directly with only the Farcaster connector
export const config = createConfig({
  chains: [celo, celoAlfajores],
  transports: {
    [celo.id]: http("https://celo-mainnet.g.alchemy.com/v2/4FF6xgfo305aOiFhplzY7M6AaWWZMmg_"),
    [celoAlfajores.id]: http("https://celo-alfajores.g.alchemy.com/v2/4FF6xgfo305aOiFhplzY7M6AaWWZMmg_"),
  },
  connectors: [
    farcasterFrame()
  ],
});

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}