'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { getCartAction, createCartAction, addToCartAction, updateCartAction, removeCartAction, applyDiscountCodeAction } from '@/lib/shopify/actions';

interface CartContextType {
  cart: any | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isLoading: boolean;
  addCartItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  applyDiscountCode: (code: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const cartId = Cookies.get('shopify_cart_id');
      if (cartId) {
        const existingCart = await getCartAction(cartId);
        if (existingCart) {
          setCart(existingCart);
        } else {
          // Cart might be expired or invalid
          Cookies.remove('shopify_cart_id');
        }
      }
      setIsLoading(false);
    };
    fetchCart();
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addCartItem = async (variantId: string, quantity = 1) => {
    setIsLoading(true);
    const cartId = Cookies.get('shopify_cart_id');
    const lines = [{ merchandiseId: variantId, quantity }];

    if (cartId) {
      const updatedCart = await addToCartAction(cartId, lines);
      if (updatedCart) setCart(updatedCart);
    } else {
      const newCart = await createCartAction(lines);
      if (newCart) {
        Cookies.set('shopify_cart_id', newCart.id, { expires: 7 }); // expires in 7 days
        setCart(newCart);
      }
    }
    
    setIsLoading(false);
    openCart();
  };

  const updateItemQuantity = async (lineId: string, quantity: number) => {
    const cartId = Cookies.get('shopify_cart_id');
    if (!cartId || !cart) return;
    
    // Optimistic UI Update
    const originalCart = { ...cart };
    setCart((prevCart: any) => {
      if (!prevCart) return prevCart;
      const newEdges = prevCart.lines.edges.map((edge: any) => {
        if (edge.node.id === lineId) {
          return { ...edge, node: { ...edge.node, quantity } };
        }
        return edge;
      });
      return { ...prevCart, lines: { ...prevCart.lines, edges: newEdges } };
    });

    const updatedCart = await updateCartAction(cartId, [{ id: lineId, quantity }]);
    if (updatedCart) {
      setCart(updatedCart);
    } else {
      setCart(originalCart); // rollback
    }
  };

  const removeItem = async (lineId: string) => {
    const cartId = Cookies.get('shopify_cart_id');
    if (!cartId || !cart) return;
    
    // Optimistic UI Update
    const originalCart = { ...cart };
    setCart((prevCart: any) => {
      if (!prevCart) return prevCart;
      const newEdges = prevCart.lines.edges.filter((edge: any) => edge.node.id !== lineId);
      return { ...prevCart, lines: { ...prevCart.lines, edges: newEdges } };
    });

    const updatedCart = await removeCartAction(cartId, [lineId]);
    if (updatedCart) {
      setCart(updatedCart);
    } else {
      setCart(originalCart); // rollback
    }
  };

  const applyDiscountCode = async (code: string) => {
    const cartId = Cookies.get('shopify_cart_id');
    if (!cartId) return;
    
    setIsLoading(true);
    const updatedCart = await applyDiscountCodeAction(cartId, [code]);
    if (updatedCart) setCart(updatedCart);
    setIsLoading(false);
  };

  return (
    <CartContext.Provider value={{ cart, isOpen, openCart, closeCart, isLoading, addCartItem, updateItemQuantity, removeItem, applyDiscountCode }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
