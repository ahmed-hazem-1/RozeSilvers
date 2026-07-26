'use client';

import { useWishlist } from '@/context/WishlistContext';
import { getProductsByHandlesAction } from '@/lib/shopify/actions';
import { useEffect, useState } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid/ProductGrid';
import { Link } from '@/i18n/routing';
import styles from './page.module.css';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      setIsLoading(true);
      if (wishlist.length > 0) {
        const data = await getProductsByHandlesAction(wishlist);
        setProducts(data);
      } else {
        setProducts([]);
      }
      setIsLoading(false);
    };

    fetchWishlist();
  }, [wishlist]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Your Wishlist</h1>
      
      {isLoading ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Loading...</p>
        </div>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>Your wishlist is currently empty.</p>
          <Link href="/collections/all" className={styles.shopLink}>
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
