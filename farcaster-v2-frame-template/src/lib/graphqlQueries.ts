import { gql, request } from 'graphql-request';

// const endpoint = 'https://staging-api.hypercerts.org/v1/graphql';
const endpoint = 'https://api.hypercerts.org/v1/graphql';

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
      data: JSON,
      [x: string]: any
    }
  }>(endpoint, query);
  return res.hypercerts;
}

export async function searchHypercerts(searchTerm: string, search_id: string, first: number = 10, offset: number = 0) {
  const query = createSearchHypercertsQuery(searchTerm, search_id, first, offset);
  const res = await request<{
    hypercerts: {
      count: number,
      data: JSON,
      [x: string]: any
    }
  }>(endpoint, query);
  return res.hypercerts;
}

export async function getHypercertById(id: string) {
  const query = createHypercertByIdQuery(id);
  const res = await request<{
    hypercerts: {
      data: JSON,
      [x: string]: any
    }
  }>(endpoint, query);
  return res.hypercerts.data || null;
}

export async function getAllHypercerts() {
  // First get the count
  const initialResult = await getHypercerts(1, 0);
  const totalCount = initialResult.count;

  // Then fetch all records
  if (totalCount > 0) {
    return getHypercerts(totalCount, 0);
  }

  return initialResult;
}
