'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { FiHeart } from 'react-icons/fi';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: any;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const tc = useTranslations('product');
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addCartItem } = useCart();
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = product.images?.edges.map((e: any) => e.node) || [];
  const price = product.priceRange?.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const variantId = product.variants?.edges[0]?.node?.id;
  const isHearted = isInWishlist(product.handle);

  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price?.amount || '0');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 2200);
    } else {
      setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

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
    <div 
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.handle}`} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          {images.length > 0 ? (
            images.map((img: any, index: number) => {
              let positionClass = styles.imageActive;
              if (index < currentImageIndex) {
                positionClass = isRtl ? styles.imageNext : styles.imagePrev;
              } else if (index > currentImageIndex) {
                positionClass = isRtl ? styles.imagePrev : styles.imageNext;
              }

              return (
                <Image
                  key={img.url + index}
                  src={img.url}
                  alt={img.altText || product.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className={`${styles.image} ${positionClass}`}
                  priority={priority && index === 0}
                />
              );
            })
          ) : (
            <div className={styles.image} style={{ backgroundColor: '#eee' }} />
          )}

          <div className={styles.shine} />

          {isOnSale && (
            <div className={styles.saleBadge}>
              {tc('sale') || 'SALE'}
            </div>
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
            <div className={styles.priceContainer}>
              {isOnSale && (
                <span className={styles.originalPrice}>
                  {parseFloat(compareAtPrice.amount).toLocaleString(undefined, {
                    style: 'currency',
                    currency: compareAtPrice.currencyCode
                  })}
                </span>
              )}
              <span className={isOnSale ? styles.salePrice : styles.price}>
                {parseFloat(price.amount).toLocaleString(undefined, {
                  style: 'currency',
                  currency: price.currencyCode
                })}
              </span>
            </div>
          )}
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
