import {
    HypercertExchangeClient,
    WETHAbi,
    addressesByNetwork,
    utils,
  } from "@hypercerts-org/marketplace-sdk";
  import { readContract } from "viem/actions";
  import { UseWalletClientReturnType } from "wagmi";
  import AppRouterInstance from "next/dist/shared/lib/app-router-context.shared-runtime"; // Fixed import statement
  import { useStepProcessDialogContext } from "./step-process-dialog";
  
  import { MarketplaceOrder } from "./types";
  import { Address } from "viem";
  
  export abstract class BuyFractionalStrategy {
    constructor(
      protected address: Address,
      protected chainId: number,
      protected exchangeClient: HypercertExchangeClient,
      protected dialogContext: ReturnType<typeof useStepProcessDialogContext>,
      protected walletClient: UseWalletClientReturnType,
      protected router: typeof AppRouterInstance,
    ) {}
  
    abstract execute(params: {
      order: MarketplaceOrder;
      unitAmount: bigint;
      pricePerUnit: string;
      hypercertName?: string | null;
      totalUnitsInHypercert?: bigint;
    }): Promise<void>;
  
    async getERC20Allowance(currency: `0x${string}`): Promise<bigint> {
      const hypercertsExchangeAddress =
        addressesByNetwork[utils.asDeployedChain(this.chainId)].EXCHANGE_V2;
  
      if (!this.walletClient.data) {
        return BigInt(0);
      }
  
      return (await readContract(this.walletClient.data, {
        abi: WETHAbi,
        address: currency as `0x${string}`,
        functionName: "allowance",
        args: [this.address, hypercertsExchangeAddress],
      })) as bigint;
    }
  }