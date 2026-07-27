'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import styles from './Footer.module.css';
import { useState } from 'react';

export function Footer() {
  const t = useTranslations('footer');
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(t('subscribeSuccess'));
      setEmail('');
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.column}>
          <h3 className={styles.title}>Rose Silvers</h3>
          <p className={styles.link} style={{ lineHeight: 1.6 }}>
            {t('brandDescription')}
          </p>
        </div>

        <div className={styles.column}>
          <h3 className={styles.title}>{t('shop')}</h3>
          <Link href="/collections/all" className={styles.link}>{t('allProducts')}</Link>
          <Link href="/collections/new" className={styles.link}>{t('newArrivals')}</Link>
          <Link href="/collections/rings" className={styles.link}>{t('rings')}</Link>
        </div>

        <div className={styles.column}>
          <h3 className={styles.title}>{t('info')}</h3>
          <Link href="/about" className={styles.link}>{t('aboutUs')}</Link>
          <Link href="/shipping" className={styles.link}>{t('shippingPolicy')}</Link>
          <Link href="/returns" className={styles.link}>{t('returnsPolicy')}</Link>
          <Link href="/privacy" className={styles.link}>{t('privacyPolicy')}</Link>
        </div>

        <div className={styles.column}>
          <h3 className={styles.title}>{t('newsletter')}</h3>
          <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder={t('newsletterPlaceholder')}
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.button}>
              {t('subscribe')}
            </button>
          </form>
        </div>
      </div>
      <div className={styles.bottom}>
        {t('copyright')}
      </div>
    </footer>
  );
}
