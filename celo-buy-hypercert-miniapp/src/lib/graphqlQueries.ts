import { gql, request } from 'graphql-request';
import { Database } from "./hypercerts-data-database";

const endpoint = 'https://api.hypercerts.org/v1/graphql';

export type MarketplaceOrder =
  Database["public"]["Tables"]["marketplace_orders"]["Row"] & {
    hypercert_id: string;
  };

// GraphQL queries remain the same...

const createHypercertsQuery = (first: number, offset: number) => gql`
  query hypercerts {
    hypercerts(
      where: {contract: {chain_id: {eq: "42220"}}}
      first: ${first}
      offset: ${offset}
    ) {
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

const createSearchHypercertsQuery = (searchTerm: string, search_id: string, first: number, offset: number) => gql`
  query searchHypercerts {
    hypercerts(
      where: {
        contract: {chain_id: {eq: "42220"}},
        hypercert_id: {contains: "${search_id}"},
        metadata: {name: {contains: "${searchTerm}"}}
      }
      first: ${first}
      offset: ${offset}
    ) {
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

const createHypercertByIdQuery = (id: string) => gql`
  query hypercertById {
    hypercerts(
      where: {hypercert_id: {eq: "${id}"}}
      first: 1
    ) {
      data {
        hypercert_id
        units
        orders {
          totalUnitsForSale
          data {
            pricePerPercentInToken
            pricePerPercentInUSD
            chainId
            currency
            signature
            additionalParameters
            signer
            price
            itemIds
            strategyId
            amounts
            id
            collectionType
            collection
            createdAt
            endTime
            orderNonce
            subsetNonce
            startTime
            globalNonce
            quoteType
            validator_codes
            hypercert_id
          }
          cheapestOrder {
            amounts
          }
        }
        metadata {
          image
          name
          work_scope
          description
        }
      }
    }
  }
`;

export async function getHypercerts(first: number = 10, offset: number = 0) {
  const query = createHypercertsQuery(first, offset);
  const res = await request<{
    hypercerts: {
      count: number,
      data: Array<{
        hypercert_id: string;
        metadata: {
          name: string;
          image: string;
          description: string;
        };
        units: number;
      }>,
    }
  }>(endpoint, query);
  return res.hypercerts;
}

export async function searchHypercerts(searchTerm: string, search_id: string, first: number = 10, offset: number = 0) {
  const query = createSearchHypercertsQuery(searchTerm, search_id, first, offset);
  const res = await request<{
    hypercerts: {
      count: number,
      data: Array<{
        hypercert_id: string;
        metadata: {
          name: string;
          image: string;
          description: string;
        };
        units: number;
      }>,
    }
  }>(endpoint, query);
  return res.hypercerts;
}

export async function getHypercertById(id: string) {
  const query = createHypercertByIdQuery(id);
  const res = await request<{
    hypercerts: {
      data: Array<{
        hypercert_id: string;
        units: number;
        orders: {
          totalUnitsForSale: number;
          data: Array<MarketplaceOrder>;
          cheapestOrder: {
            amounts: Array<number>;
          };
        };
        metadata: {
          image: string;
          name: string;
          work_scope: Array<string> | string;
          description: string;
        };
      }>,
    }
  }>(endpoint, query);
  return res.hypercerts.data || null;
}

export async function getAllHypercerts() {
  const initialResult = await getHypercerts(1, 0);
  const totalCount = initialResult.count;
  if (totalCount > 0) {
    return getHypercerts(totalCount, 0);
  }
  return initialResult;
}

/**
 * Calculates price per unit based on price per percent and total units
 */
export const getPricePerUnit = (
  pricePerPercent: string,
  totalUnits: bigint,
) => {
  const pricePerPercentBigInt = BigInt(pricePerPercent);
  const unitsPerPercent = totalUnits / BigInt(100);
  return pricePerPercentBigInt / unitsPerPercent;
};

/**
 * Buy a fraction of a hypercert based on the exact implementation from the repository
 */
// export async function buyHypercertFraction(
//   order: MarketplaceOrder,
//   unitsToBuy: bigint,
//   recipientAddress: string,
//   totalUnitsInHypercert: bigint,
//   signer: Signer
// ) {
//   try {
//     // Initialize client with the signer only, ensuring provider is not null
//     const provider = signer.provider;
//     if (!provider) {
//       throw new Error('Signer provider is null');
//     }
//     const hypercertExchangeClient = new HypercertExchangeClient(ChainId.CELO, provider, signer);
    
//     // Get buyer address from signer
//     const buyerAddress = await signer.getAddress();
//     // Create taker order - structure exactly matching the repository
//     const takerOrder = {
//       recipient: recipientAddress,
//       buyer: buyerAddress,
//       units: unitsToBuy.toString(),
//       price: order.price,
//       currency: order.currency,
//       chainId: order.chainId,
//       additionalParameters: order.additionalParameters || '0x',
//     };

//     // Check if using native currency or ERC20 token
//     const zeroAddress = '0x0000000000000000000000000000000000000000';
    
//     // Set overrides for native currency
//     const overrides = order.currency === zeroAddress 
//       ? { value: BigInt(order.price) * unitsToBuy / BigInt(order.amounts[0]) } 
//       : {};
    
//     // For ERC20 tokens, check and approve if needed
//     if (order.currency !== zeroAddress) {
//       const erc20Interface = new ethers.Interface([
//         'function allowance(address owner, address spender) view returns (uint256)',
//         'function approve(address spender, uint256 amount) returns (bool)',
//       ]);
      
//       const erc20Contract = new ethers.Contract(order.currency, erc20Interface, signer);
      
//       // Get the exchange address from the client
//       const exchangeAddress = hypercertExchangeClient.addresses.EXCHANGE_V2;
      
//       // Check current allowance
//       const allowance = await erc20Contract.allowance(buyerAddress, exchangeAddress);
      
//       // Calculate required allowance
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const requiredAllowance = BigInt(order.pricePerPercentInToken as any * 1e18) * unitsToBuy / BigInt(order.amounts[0]);

//       console.log("allowance", allowance, requiredAllowance)
      
//       // Approve if needed
//       if (allowance < requiredAllowance) {
//         console.log(`Approving ${requiredAllowance} for ${order.currency}`);
//         const tx = await erc20Contract.approve(exchangeAddress, requiredAllowance);
//         await tx.wait();
//       }
//       console.log("allowance done")
//     }
    
//     // Validation checks
//     if (order.endTime < Math.floor(Date.now() / 1000)) {
//       throw new Error('Order has expired');
//     }
    
//     if (order.chainId.toString() !== ChainId.CELO.toString()) {
//       throw new Error('Order chain ID does not match Celo');
//     }

//     console.log('Executing order with:');
//     console.log('- Maker order:', order);
//     console.log('- Taker order:', takerOrder);
//     console.log('- Overrides:', overrides);

//     // Execute the order
//     const tx = await hypercertExchangeClient.executeOrder(
//       order,
//       takerOrder,
//       order.signature,
//       undefined, // No validator codes needed
//       overrides
//     ).call();

//     // console.log('Transaction submitted:', tx.hash);
//     const receipt = tx.wait();
//     console.log('Transaction confirmed:', receipt);

//     return {
//       success: true,
//       transactionHash: "receipt.hash",
//       receipt,
//     };
//      // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.error('Error buying hypercert fraction:', error);
    
//     // Provide detailed error information for debugging
//     const errorDetails = {
//       message: error.message || 'Unknown error',
//       code: error.code,
//       data: error.data,
//       reason: error.reason
//     };
    
//     console.error('Error details:', errorDetails);
    
//     return {
//       success: false,
//       error: errorDetails.message,
//       details: errorDetails
//     };
//   }
// }