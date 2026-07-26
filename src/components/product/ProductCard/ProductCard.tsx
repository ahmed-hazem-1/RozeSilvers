'use client';

import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button/Button';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: any;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const t = useTranslations('nav'); // or 'product' if you prefer, but 'nav' is loaded usually. Let's use getTranslations in server or just raw text if not available? Wait, next-intl works in client too.
  const tc = useTranslations('product');
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addCartItem } = useCart();

  const imageUrl = product.images?.edges[0]?.node?.url;
  const imageAlt = product.images?.edges[0]?.node?.altText || product.title;
  const price = product.priceRange?.minVariantPrice;
  const variantId = product.variants?.edges[0]?.node?.id;
  const isHearted = isInWishlist(product.handle);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.handle);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variantId) {
      addCartItem(variantId, 1);
    }
  };

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.handle}`} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={styles.image}
              priority={priority}
            />
          ) : (
            <div className={styles.image} style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
          )}
          
          <button 
            className={`${styles.heartBtn} ${isHearted ? styles.hearted : ''}`}
            onClick={handleHeartClick}
            aria-label="Wishlist"
          >
            <FiHeart size={18} fill={isHearted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </Link>

      <div className={styles.details}>
        <Link href={`/products/${product.handle}`} style={{ textDecoration: 'none' }}>
          <h3 className={styles.title}>{product.title}</h3>
          {price && (
            <p className={styles.price}>
              {parseFloat(price.amount).toLocaleString(undefined, {
                style: 'currency',
                currency: price.currencyCode
              })}
            </p>
          )}
          {/* Mock color field for ASOS layout */}
          <p className={styles.subText}>Silver</p>
        </Link>
        
        <div className={styles.actions}>
          <button className={styles.addToCartBtn} onClick={handleAddToCart}>
            {tc('addToCart') || 'ADD TO BAG'}
          </button>
        </div>
      </div>
    </div>
  );
}
