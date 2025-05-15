"use client"
import { HypercertClient } from "@hypercerts-org/sdk";
import { useWalletClient, usePublicClient } from "wagmi";
import { gql, request } from 'graphql-request';

export const useHypercertClient = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const graphUrl = "https://api.hypercerts.org/v1/graphql";
  const ENVIRONMENT = "production";

  const client = new HypercertClient({
    environment: ENVIRONMENT,
    walletClient,
    publicClient,
    graphUrl
  });

  console.log("getDeployments", client.getDeployments)

  return { client };
};
// const test = useHypercertClient();

// console.log("tessssssst", test)

const query = gql`
  query hypercerts {
    hypercerts {
      count
      data {
        hypercert_id
        metadata {
            name
            image
            description
        }
        units
      }
    }
  }
`;

export async function getHypercerts() {
  try {
    const res = await request("https://api.hypercerts.org/v1/graphql", query);
    console.log("Hypercerts:", res);
    return res;
  } catch (error) {
    console.error("Error fetching hypercerts:", error);
    throw error;
  }
}