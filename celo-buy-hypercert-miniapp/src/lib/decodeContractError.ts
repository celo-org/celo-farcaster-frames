import { decodeErrorResult } from "viem";
import {
  HypercertExchangeAbi,
  TransferManagerAbi,
  OrderValidatorV2AAbi,
} from "@hypercerts-org/contracts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeContractError(error: unknown, defaultMessage: string) {
  const abis = [TransferManagerAbi, HypercertExchangeAbi, OrderValidatorV2AAbi];
  const transactionData = (
    (error as { info?: { error?: { data?: { originalError?: { data?: unknown } } } } })?.info?.error?.data?.originalError?.data ||
    (error as { data?: { originalError?: { data?: unknown } } })?.data?.originalError?.data ||
    (error as { data?: { data?: unknown } })?.data?.data ||
    (error as { data?: unknown })?.data
  ) as `0x${string}` | undefined;

  if (!transactionData) {
    return defaultMessage;
  }

  let parsedError: string | undefined;

  for (const abi of abis) {
    try {
      const decodedError = decodeErrorResult({
        abi,
        data: transactionData,
      });
      if (decodedError) {
        parsedError = decodedError.errorName;
        break;
      }
    } catch {
      continue;
    }
  }

  return parsedError || defaultMessage;
}