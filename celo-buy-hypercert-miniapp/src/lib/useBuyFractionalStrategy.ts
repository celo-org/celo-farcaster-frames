import { useAccount, useWalletClient } from "wagmi";
import { useRouter } from "next/navigation";
import { useHypercertExchangeClient } from "./use-hypercert-exchange-client";
import { useStepProcessDialogContext } from "./step-process-dialog";
import { BuyFractionalStrategy } from "./BuyFractionalStrategy";
import { EOABuyFractionalStrategy } from "../components/EOABuyFractionalStrategy";
import { SafeBuyFractionalStrategy } from "~/components/SafeBuyFractionalStrategy";
import { getAddress, isAddress } from "viem";
import { useAccountStore } from "./account-store";
// import { createContext, useContext } from "react";

export const useBuyFractionalStrategy = (): (() => BuyFractionalStrategy) => {
  const { address, chainId } = useAccount();
  const dialogContext = useStepProcessDialogContext();
  const { client: exchangeClient } = useHypercertExchangeClient();
  const router = useRouter();
  const walletClient = useWalletClient();

  const { selectedAccount } = useAccountStore();
  const activeAddress = selectedAccount?.address || address;

  return () => {
    if (!activeAddress || !isAddress(activeAddress))
      throw new Error("No address found");
    if (!chainId) throw new Error("No chainId found");
    if (!exchangeClient) throw new Error("No HypercertExchangeClient found");
    if (!walletClient) throw new Error("No walletClient found");
    if (!dialogContext) throw new Error("No dialogContext found");
    if (!router) throw new Error("No router found");

    const buyerAddress = getAddress(activeAddress);

    if (selectedAccount?.type === "safe") {
      if (!selectedAccount) throw new Error("No selected account found");
      return new SafeBuyFractionalStrategy(
        buyerAddress,
        chainId,
        exchangeClient,
        dialogContext,
        walletClient,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push as any,
      );
    }
    console.log("not safe")
    return new EOABuyFractionalStrategy(
      buyerAddress,
      chainId,
      exchangeClient,
      dialogContext,
      walletClient,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push as any,
    );
  };
};