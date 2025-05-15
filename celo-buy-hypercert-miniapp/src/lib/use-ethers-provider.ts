import { PublicClient } from "viem";
import { JsonRpcProvider } from "ethers";

import { usePublicClient } from "wagmi";
import React from "react";

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  if (!chain || !transport) return undefined;

  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };

  const rpcUrl = "https://celo-mainnet.g.alchemy.com/v2/4FF6xgfo305aOiFhplzY7M6AaWWZMmg_"; 
  return new JsonRpcProvider(rpcUrl, network);
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  return React.useMemo(() => {
    if (publicClient === undefined) return undefined;
    return publicClientToProvider(publicClient);
  }, [publicClient]);
}