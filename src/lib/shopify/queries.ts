export const getProductQuery = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      productType
      vendor
      tags
      priceRange {
        minVariantPrice { amount currencyCode }
        maxVariantPrice { amount currencyCode }
      }
      compareAtPriceRange {
        minVariantPrice { amount currencyCode }
      }
      images(first: 10) {
        edges { node { url altText width height } }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions { name value }
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            image { url altText }
          }
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "material" },
        { namespace: "custom", key: "weight" },
        { namespace: "custom", key: "care_instructions" }
      ]) {
        key value type
      }
    }
  }
`;

export const getAllProductsQuery = `
  query getProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          id title handle productType vendor
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount currencyCode } }
          images(first: 2) { edges { node { url altText } } }
          availableForSale
          variants(first: 5) {
            edges { node { id title availableForSale selectedOptions { name value } } }
          }
        }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;
export const getCollectionQuery = `
  query CollectionByHandle($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean, $filters: [ProductFilter!]) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image { url altText }
      products(first: $first, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        edges {
          node {
            id title handle productType vendor
            priceRange { minVariantPrice { amount currencyCode } }
            compareAtPriceRange { minVariantPrice { amount currencyCode } }
            images(first: 2) { edges { node { url altText } } }
            availableForSale
            variants(first: 5) {
              edges { node { id title availableForSale selectedOptions { name value } } }
            }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;

export const searchQuery = `
  query Search($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      edges {
        node {
          ... on Product {
            id title handle productType
            priceRange { minVariantPrice { amount currencyCode } }
            images(first: 1) { edges { node { url altText } } }
          }
        }
      }
    }
  }
`;
