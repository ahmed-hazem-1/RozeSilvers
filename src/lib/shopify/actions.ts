'use server';

import { shopifyFetch } from './client';
import { getProductQuery } from './queries';

export async function getProductsByHandles(handles: string[]) {
  if (!handles || handles.length === 0) return [];

  const promises = handles.map(handle => 
    shopifyFetch<any>({
      query: getProductQuery,
      variables: { handle }
    })
  );

  try {
    const results = await Promise.all(promises);
    return results
      .map(res => res.body?.data?.product)
      .filter(Boolean); // Filter out nulls
  } catch (e) {
    console.error('Failed to fetch wishlist products', e);
    return [];
  }
}

export async function createCartAction(lines: any[]) {
  try {
    const { createCartMutation } = await import('./mutations');
    const res = await shopifyFetch<any>({
      query: createCartMutation,
      variables: { input: { lines } },
      cache: 'no-store'
    });
    return res.body?.data?.cartCreate?.cart;
  } catch (e) {
    console.error('Error creating cart:', e);
    return null;
  }
}

export async function addToCartAction(cartId: string, lines: any[]) {
  try {
    const { addToCartMutation } = await import('./mutations');
    const res = await shopifyFetch<any>({
      query: addToCartMutation,
      variables: { cartId, lines },
      cache: 'no-store'
    });
    return res.body?.data?.cartLinesAdd?.cart;
  } catch (e) {
    console.error('Error adding to cart:', e);
    return null;
  }
}

export async function getCartAction(cartId: string) {
  try {
    // We don't have getCartQuery yet, let's write it here or in queries
    const query = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          totalQuantity
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price { amount currencyCode }
                    image { url altText }
                    product { title handle }
                  }
                }
              }
            }
          }
          cost {
            totalAmount { amount currencyCode }
            subtotalAmount { amount currencyCode }
          }
          discountCodes {
            code
            applicable
          }
        }
      }
    `;
    const res = await shopifyFetch<any>({
      query,
      variables: { cartId },
      cache: 'no-store'
    });
    return res.body?.data?.cart;
  } catch (e) {
    console.error('Error fetching cart:', e);
    return null;
  }
}

export async function updateCartAction(cartId: string, lines: any[]) {
  try {
    const { updateCartMutation } = await import('./mutations');
    const res = await shopifyFetch<any>({
      query: updateCartMutation,
      variables: { cartId, lines },
      cache: 'no-store'
    });
    return res.body?.data?.cartLinesUpdate?.cart;
  } catch (e) {
    console.error('Error updating cart:', e);
    return null;
  }
}

export async function removeCartAction(cartId: string, lineIds: string[]) {
  try {
    const { removeFromCartMutation } = await import('./mutations');
    const res = await shopifyFetch<any>({
      query: removeFromCartMutation,
      variables: { cartId, lineIds },
      cache: 'no-store'
    });
    return res.body?.data?.cartLinesRemove?.cart;
  } catch (e) {
    console.error('Error removing from cart:', e);
    return null;
  }
}

export async function applyDiscountCodeAction(cartId: string, codes: string[]) {
  try {
    const { cartDiscountCodesUpdateMutation } = await import('./mutations');
    const res = await shopifyFetch<any>({
      query: cartDiscountCodesUpdateMutation,
      variables: { cartId, discountCodes: codes },
      cache: 'no-store'
    });
    return res.body?.data?.cartDiscountCodesUpdate?.cart;
  } catch (e) {
    console.error('Error applying discount:', e);
    return null;
  }
}

export async function getProductsByHandlesAction(handles: string[]) {
  try {
    if (!handles || handles.length === 0) return [];
    
    // Shopify Storefront API query for handles using OR is sometimes flaky.
    // Fetch a larger pool and filter strictly by handle to guarantee exact match.
    const queryStr = handles.map(h => `handle:${h}`).join(' OR ');
    
    const { getAllProductsQuery } = await import('./queries');
    const res = await shopifyFetch<any>({
      query: getAllProductsQuery,
      variables: { first: 250, query: queryStr },
      cache: 'no-store'
    });
    
    const allFetched = res.body?.data?.products?.edges || [];
    return allFetched.filter((edge: any) => handles.includes(edge.node.handle));
  } catch (e) {
    console.error('Error fetching wishlist products:', e);
    return [];
  }
}
