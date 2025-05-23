"use client";
import { SUPPORTED_CHAINS } from "./constants";
import { HYPERCERTS_API_URL_REST } from "./hypercerts";
import { useEthersProvider } from "./use-ethers-provider";
import { useEthersSigner } from "./use-ethers-signer";
import { HypercertExchangeClient } from "@hypercerts-org/marketplace-sdk";
import { useMemo } from "react";
import { useChainId, useWalletClient } from "wagmi";

export const useHypercertExchangeClient = () => {
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  const client = useMemo(() => {
    if (
      !SUPPORTED_CHAINS.find((chain) => chain.id === walletClient?.chain.id) ||
      chainId === 314 ||
      chainId === 314159
    ) {
      return null;
    }

    return new HypercertExchangeClient(
      chainId,
      // @ts-expect-error - wagmi and viem have different typing
      provider,
      signer,
      {
        apiEndpoint: HYPERCERTS_API_URL_REST,
      },
      walletClient,
    );
  }, [walletClient, chainId, provider, signer]);

  return { client };
};