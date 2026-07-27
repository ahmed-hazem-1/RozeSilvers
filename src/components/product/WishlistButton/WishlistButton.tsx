'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useTranslations } from 'next-intl';
import { FiHeart } from 'react-icons/fi';
import styles from './WishlistButton.module.css';

interface WishlistButtonProps {
  handle: string;
  variant?: 'button' | 'icon';
}

export function WishlistButton({ handle, variant = 'button' }: WishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isHearted = isInWishlist(handle);
  const t = useTranslations('product');

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(handle);
  };

  if (variant === 'icon') {
    return (
      <button 
        onClick={handleClick}
        className={`${styles.iconOnlyBtn} ${isHearted ? styles.hearted : ''}`}
        aria-label="Wishlist"
        title={isHearted ? t('removeFromWishlist') : t('addToWishlist')}
      >
        <FiHeart size={22} fill={isHearted ? 'currentColor' : 'none'} />
      </button>
    );
  }

  return (
    <button 
      onClick={handleClick}
      className={`${styles.fullBtn} ${isHearted ? styles.hearted : ''}`}
      type="button"
    >
      <FiHeart size={18} fill={isHearted ? 'currentColor' : 'none'} />
      <span>{isHearted ? t('removeFromWishlist') : t('addToWishlist')}</span>
    </button>
  );
}
