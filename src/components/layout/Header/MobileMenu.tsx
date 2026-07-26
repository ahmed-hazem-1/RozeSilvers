import { Link } from '@/i18n/routing';
import { FiX } from 'react-icons/fi';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations('nav');
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
