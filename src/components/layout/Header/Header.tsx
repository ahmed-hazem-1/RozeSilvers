'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { FiSearch, FiShoppingBag, FiMenu, FiUser, FiHeart } from 'react-icons/fi';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from './Header.module.css';
import { useState } from 'react';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const t = useTranslations('nav');
  const { openCart, cart } = useCart();
  const { wishlist } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/customer-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error('Failed to get customer url', e);
      // Fallback if backend is down
      window.location.href = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/account/login`;
    }
  };

  const totalQuantity = cart?.totalQuantity || 0;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        
        {/* Mobile Menu Toggle */}
        <div className={styles.mobileMenuBtn}>
          <button className={styles.iconButton} onClick={() => setIsMenuOpen(true)}>
            <FiMenu size={20} />
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          <Link href="/collections/all" className={styles.navLink}>{t('shop')}</Link>
          <Link href="/about" className={styles.navLink}>{t('about')}</Link>
        </nav>

        {/* Logo */}
        <Link href="/" className={styles.logo}>
          Roze Silvers
        </Link>

        {/* Actions */}
        <div className={styles.actions} style={{ flex: 1, justifyContent: 'flex-end' }}>
          <button className={styles.iconButton} aria-label="Search">
            <FiSearch size={20} />
          </button>
          
          <Link href="/wishlist" className={styles.iconButton} aria-label="Wishlist">
            <FiHeart size={20} />
            {wishlist.length > 0 && (
              <span className={styles.cartCount}>{wishlist.length}</span>
            )}
          </Link>
          
          <button className={styles.iconButton} onClick={handleLoginClick} aria-label="Account">
            <FiUser size={20} />
          </button>

          <button className={styles.iconButton} onClick={openCart} aria-label="Cart">
            <FiShoppingBag size={20} />
            {totalQuantity > 0 && (
              <span className={styles.cartCount}>{totalQuantity}</span>
            )}
          </button>
        </div>
      </div>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
}
