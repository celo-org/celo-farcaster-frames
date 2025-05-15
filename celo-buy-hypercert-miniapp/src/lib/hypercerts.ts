import { parseUnits } from "viem";
// import { CONSTANTS } from "@hypercerts-org/sdk";
// import { ENVIRONMENT } from "./constants";

// const HYPERCERT_API_URL = "https://api.hypercerts.org";

export const HYPERCERTS_API_URL_REST = `https://api.hypercerts.org/v1`;
export const HYPERCERTS_API_URL_GRAPH = `https://api.hypercerts.org/v1/graphql`;

export const DEFAULT_NUM_UNITS_DECIMALS = 8;
export const DEFAULT_NUM_UNITS = parseUnits("1", DEFAULT_NUM_UNITS_DECIMALS);

export const DEFAULT_DISPLAY_CURRENCY = "usd";