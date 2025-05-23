import {
  ChainId,
  currenciesByNetwork,
  Currency,
} from "@hypercerts-org/marketplace-sdk";
import {
  decodeAbiParameters,
  formatUnits,
  getAddress,
  parseAbiParameters,
  parseUnits,
} from "viem";
import { OrderFragment } from "./order.fragment";
import { MarketplaceOrder } from "./types";
import { HypercertFull } from "./hypercert-full.fragment";

export const getCurrencyByAddress = (chainId: ChainId, address: string) => {
  const currenciesForNetwork = currenciesByNetwork[chainId];
  const allCurrencies = Object.values(currenciesForNetwork) as Currency[];

  return allCurrencies.find(
    (currency) => getAddress(currency.address) === getAddress(address),
  );
};

export const decodeFractionalOrderParams = (params: string) => {
  const [minUnitAmount, maxUnitAmount, minUnitsToKeep, sellLeftoverFraction] =
    decodeAbiParameters(
      parseAbiParameters(
        "uint256 minUnitAmount, uint256 maxUnitAmount, uint256 minUnitsToKeep, uint256 sellLeftoverFraction",
      ),
      params as `0x{string}`,
    );

  return {
    minUnitAmount,
    maxUnitAmount,
    minUnitsToKeep,
    sellLeftoverFraction: !!sellLeftoverFraction,
  };
};

export const getPricePerUnit = (
  pricePerPercentWei: string,
  totalUnits: bigint,
) => {
  const unitsPerPercent = totalUnits / BigInt(100);
  return BigInt(pricePerPercentWei) / unitsPerPercent;
};

export const getPricePerPercent = (priceInWei: string, totalUnits: bigint) => {
  const unitsPerPercent = totalUnits / BigInt(100);
  return BigInt(priceInWei) * unitsPerPercent;
};

export const formatPrice = (
  chainId: number | string | null | undefined,
  units: bigint,
  currency: string,
  includeSymbol = false,
) => {
  if (!chainId) {
    return "Unknown chain";
  }

  const parsedChainId =
    typeof chainId === "number" ? chainId : parseInt(chainId, 10);

  const currencyData = getCurrencyByAddress(parsedChainId, currency);

  if (!currencyData) {
    return "Unknown currency";
  }

  const formattedUnits = formatUnits(units, currencyData.decimals);

  if (includeSymbol) {
    return `${formattedUnits} ${currencyData.symbol}`;
  }

  return formattedUnits;
};

export const orderFragmentToMarketplaceOrder = (
  order: OrderFragment,
): MarketplaceOrder => {
  if (!order || typeof order.chainId === undefined) {
    throw new Error("Order does not have a valid chain ID");
  }
  return {
    signer: order.signer,
    price: order.price,
    itemIds: order.itemIds,
    strategyId: order.strategyId,
    chainId: order.chainId ? parseInt(order.chainId, 10) : 0,
    additionalParameters: order.additionalParameters,
    invalidated: order.invalidated,
    currency: order.currency,
    amounts: order.amounts,
    id: order.id,
    collectionType: order.collectionType,
    collection: order.collection,
    createdAt: order.createdAt,
    endTime: order.endTime,
    orderNonce: order.orderNonce,
    subsetNonce: order.subsetNonce,
    startTime: order.startTime,
    globalNonce: order.globalNonce,
    quoteType: order.quoteType,
    signature: order.signature,
    validator_codes:
      order.validator_codes?.map((code) => parseInt(code, 10)) || null,
    hypercert_id: order.hypercert_id,
  };
};

export const orderFragmentToHypercert = (
  order: OrderFragment,
): HypercertFull => {
  return order.hypercert as unknown as HypercertFull;
};

export const getMinimumPrice = (
  unitsForSale: bigint | string | undefined,
  chainId: number,
  currencyAddress: string,
) => {
  const currency = getCurrencyByAddress(chainId, currencyAddress);
  return formatUnits(BigInt(unitsForSale || "0"), currency?.decimals || 0);
};

export const isTokenDividableBy = (
  numerator: string,
  denominator: string | undefined,
  chainId: number,
  currencyAddress: string,
) => {
  const currency = getCurrencyByAddress(chainId, currencyAddress);
  if (!currency) {
    throw new Error(`Currency not found for address ${currencyAddress}`);
  }
  const remainder =
    parseUnits(numerator, currency.decimals) %
    (parseUnits(denominator || "1", currency.decimals) || BigInt(1));
  return remainder === BigInt(0);
};