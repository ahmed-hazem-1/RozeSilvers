'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button/Button';
import styles from './Hero.module.css';

const IMAGES = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599643478524-fb66f72400ae?q=80&w=2000&auto=format&fit=crop'
];

export function Hero() {
  const t = useTranslations('common');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <section className={styles.hero}>
      {IMAGES.map((src, index) => (
        <div 
          key={src}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>{t('heroTitle')}</h1>
        <p className={styles.subtitle}>{t('heroSubtitle')}</p>
        <Button href="/collections/all" variant="primary" size="large" style={{ backgroundColor: '#fff', color: '#111' }}>
          {t('shopNow')}
        </Button>
      </div>
    </section>
  );
}
