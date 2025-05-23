import { Currency, Taker } from "@hypercerts-org/marketplace-sdk";
import { zeroAddress } from "viem";
import { waitForTransactionReceipt } from "viem/actions";

import { SUPPORTED_CHAINS } from "~/lib/constants";
// import { calculateBigIntPercentage } from "~/lib/calculateBigIntPercentage";
import { decodeContractError } from "~/lib/decodeContractError";

import { BuyFractionalStrategy } from "../lib/BuyFractionalStrategy";
import { MarketplaceOrder } from "../lib/types";
import { getCurrencyByAddress } from "../lib/hypercerts-utils";
import { ExtraContent } from "~/components/extra-content";
import { useStore } from "~/lib/account-store";


const calculateBigIntPercentage = (
  numerator: bigint | string | null | undefined,
  denominator: bigint | string | null | undefined,
) => {
  if (!numerator || !denominator) {
    return undefined;
  }
  const numeratorBigInt = BigInt(numerator);
  const denominatorBigInt = BigInt(denominator);
  const precision = 10 ** 18;
  const unCorrected = Number(
    (numeratorBigInt * BigInt(100) * BigInt(precision)) / denominatorBigInt,
  );
  return unCorrected / precision;
};

export class EOABuyFractionalStrategy extends BuyFractionalStrategy {
  async execute({
    order,
    unitAmount,
    pricePerUnit,
    hypercertName,
    totalUnitsInHypercert,
  }: {
    order: MarketplaceOrder;
    unitAmount: bigint;
    pricePerUnit: string;
    hypercertName?: string | null;
    totalUnitsInHypercert?: bigint;
  }) {
    const {
      setDialogStep: setStep,
      setSteps,
      setOpen,
      setExtraContent,
    } = this.dialogContext;
    if (!this.exchangeClient) {
      this.dialogContext.setOpen(false);
      throw new Error("No client");
    }

    if (!this.chainId) {
      this.dialogContext.setOpen(false);
      throw new Error("No chain id");
    }

    if (!this.walletClient.data) {
      this.dialogContext.setOpen(false);
      throw new Error("No wallet client data");
    }

    setSteps([
      {
        id: "Setting up order execution",
        description: "Setting up order execution",
      },
      {
        id: "ERC20",
        description: "Setting approval",
      },
      {
        id: "Transfer manager",
        description: "Approving transfer manager",
      },
      {
        id: "Awaiting buy signature",
        description: "Awaiting buy signature",
      },
      {
        id: "Awaiting confirmation",
        description: "Awaiting confirmation",
      },
    ]);
    setOpen(true);

    let currency: Currency | undefined;
    let takerOrder: Taker;
    
    try {
      await setStep("Setting up order execution");
      currency = getCurrencyByAddress(order.chainId, order.currency);

      if (!currency) {
        throw new Error(
          `Invalid currency ${order.currency} on chain ${order.chainId}`,
        );
      }

      takerOrder = this.exchangeClient.createFractionalSaleTakerBid(
        order,
        this.address,
        unitAmount.toString(),
        pricePerUnit,
      );
    } catch (e) {
      await setStep(
        "Setting up order execution",
        "error",
        e instanceof Error ? e.message : "Error setting up order execution",
      );
      console.error(e);
      throw new Error("Error setting up order execution");
    }

    if (!currency) {
      throw new Error(
        `Invalid currency ${order.currency} on chain ${order.chainId}`,
      );
    }

    const totalPrice = BigInt(order.price) * unitAmount;
    try {
      await setStep("ERC20");
      if (currency.address !== zeroAddress) {
        const currentAllowance = await this.getERC20Allowance(
          order.currency as `0x${string}`,
        );

        if (currentAllowance < totalPrice) {
          const approveTx = await this.exchangeClient.approveErc20(
            order.currency,
            totalPrice,
          );
          await waitForTransactionReceipt(this.walletClient.data, {
            hash: approveTx.hash as `0x${string}`,
          });
        }
      }
    } catch (e) {
      await setStep(
        "ERC20",
        "error",
        e instanceof Error ? e.message : "Approval error",
      );
      console.error(e);
      throw new Error("Approval error");
    }

    try {
      await setStep("Transfer manager");
      const isTransferManagerApproved =
        await this.exchangeClient.isTransferManagerApproved();
      // FIXME: this shouldn't be here, unless I'm missing something
      if (!isTransferManagerApproved) {
        const transferManagerApprove = await this.exchangeClient
          .grantTransferManagerApproval()
          .call();
        await waitForTransactionReceipt(this.walletClient.data, {
          hash: transferManagerApprove.hash as `0x${string}`,
        });
      }
    } catch (e) {
      await setStep(
        "Transfer manager",
        "error",
        e instanceof Error ? e.message : "Error approving transfer manager",
      );
      console.error(e);
      throw new Error("Approval error");
    }

    try {
      await setStep("Setting up order execution");
      const overrides =
        currency.address === zeroAddress ? { value: totalPrice } : undefined;
      const { call } = this.exchangeClient.executeOrder(
        order,
        takerOrder,
        order.signature,
        undefined,
        overrides,
      );
      await setStep("Awaiting buy signature");
      const tx = await call();
      await setStep("Awaiting confirmation");
      const receipt = await waitForTransactionReceipt(this.walletClient.data, {
        hash: tx.hash as `0x${string}`,
      });
      useStore.getState().emitHash(receipt);
      const chain = SUPPORTED_CHAINS.find((x) => x.id === order.chainId);
      await setStep("Awaiting confirmation", "completed");
      const message =
        hypercertName && totalUnitsInHypercert !== undefined ? (
          <span>
            Congratulations, you successfully bought{" "}
            <b>
              {calculateBigIntPercentage(unitAmount, totalUnitsInHypercert)}%
            </b>{" "}
            of <b>{hypercertName}</b>.
          </span>
        ) : (
          "Your transaction was successful"
        );

      setExtraContent(() => (
        <ExtraContent
          message={message}
          hypercertId={order.hypercert_id}
          onClose={() => setOpen(false)}
          chain={chain!}
          receipt={receipt}
        />
      ));
    } catch (e) {
      const decodedMessage = decodeContractError(e, "Error buying listing");
      await setStep("Awaiting confirmation", "error", decodedMessage);

      console.error(e);
      throw new Error(decodedMessage);
    }
  }
}