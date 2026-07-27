'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistContextType {
  wishlist: string[]; // array of product handles
  toggleWishlist: (handle: string) => void;
  isInWishlist: (handle: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('rose_wishlist');
    if (stored) {
      try {
        setWishlist(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('rose_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const toggleWishlist = (handle: string) => {
    setWishlist((prev) => {
      if (prev.includes(handle)) {
        return prev.filter((h) => h !== handle);
      }
      return [...prev, handle];
    });
  };

  const isInWishlist = (handle: string) => wishlist.includes(handle);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
