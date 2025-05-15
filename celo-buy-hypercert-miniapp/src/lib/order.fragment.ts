import { ResultOf, graphql } from "./graphql";

export const OrderFragment = graphql(`
  fragment OrderFragment on Order {
    additionalParameters
    invalidated
    validator_codes
    amounts
    chainId
    collection
    collectionType
    createdAt
    currency
    globalNonce
    endTime
    id
    itemIds
    orderNonce
    price
    quoteType
    signature
    signer
    startTime
    strategyId
    subsetNonce
    invalidated
    hypercert_id
    pricePerPercentInUSD
    pricePerPercentInToken
    hypercert {
      hypercert_id
      creator_address
      contracts_id
      creation_block_number
      creation_block_timestamp
      id
      last_update_block_number
      last_update_block_timestamp
      metadata {
        allow_list_uri
        contributors
        description
        external_url
        id
        impact_scope
        impact_timeframe_from
        impact_timeframe_to
        name
        properties
        rights
        uri
        work_scope
        work_timeframe_from
        work_timeframe_to
      }
      token_id
      units
      uri
    }
  }
`);

export type OrderFragment = ResultOf<typeof OrderFragment>;