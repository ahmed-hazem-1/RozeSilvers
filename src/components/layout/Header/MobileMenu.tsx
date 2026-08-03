import { Link } from '@/i18n/routing';
import { FiX, FiSearch } from 'react-icons/fi';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch?: () => void;
}

export function MobileMenu({ isOpen, onClose, onOpenSearch }: MobileMenuProps) {
  const t = useTranslations('nav');
  const ts = useTranslations('search');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.menu}>
        <div className={styles.header}>
          {onOpenSearch && (
            <button
              type="button"
              className={styles.searchTrigger}
              onClick={() => {
                onClose();
                onOpenSearch();
              }}
              aria-label="Search"
            >
              <FiSearch size={16} />
              <span>{ts('placeholder') || 'Search products...'}</span>
            </button>
          )}
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
            <FiX size={24} />
          </button>
        </div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.link} onClick={onClose}>{t('home')}</Link>
          <Link href="/collections/all" className={styles.link} onClick={onClose}>{t('shop')}</Link>
          <Link href="/about" className={styles.link} onClick={onClose}>{t('about')}</Link>
          <Link href="/contact" className={styles.link} onClick={onClose}>{t('contact')}</Link>
        </nav>
      </div>
    </>,
    document.body
  );
}
