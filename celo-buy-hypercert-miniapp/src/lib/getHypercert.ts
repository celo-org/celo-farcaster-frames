import { graphql, readFragment } from "./graphql";
import { HypercertFullFragment } from "./hypercert-full.fragment";
import request from "graphql-request";
import { getAddress, isAddress } from "viem";

const query = graphql(
  `
    query Hypercert($hypercert_id: String) {
      hypercerts(where: { hypercert_id: { eq: $hypercert_id } }) {
        data {
          ...HypercertFullFragment
        }
      }
    }
  `,
  [HypercertFullFragment],
);

export async function getHypercert(hypercertId: string) {
  const [chainId, contractAddress, tokenId] = hypercertId.split("-");

  if (!chainId || !contractAddress || !tokenId) {
    console.error("Invalid hypercertId");
    return undefined;
  }

  const _contractAddress = getAddress(contractAddress);

  // TODO: Throw error?
  if (!isAddress(_contractAddress)) {
    console.error("Invalid address");
    return undefined;
  }

  const res = await request("https://api.hypercerts.org/v1/graphql", query, {
    hypercert_id: `${chainId}-${_contractAddress}-${tokenId}`,
  });

  const hypercertFullFragment = res.hypercerts?.data?.[0];
  if (!hypercertFullFragment) {
    return undefined;
  }

  return readFragment(HypercertFullFragment, hypercertFullFragment);
}