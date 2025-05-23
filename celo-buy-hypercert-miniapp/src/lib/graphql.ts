import { introspection } from "./graphql-hypercerts-env";
import { initGraphQLTada } from "gql.tada";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    BigInt: string | null | undefined;
    EthBigInt: string | null | undefined;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";