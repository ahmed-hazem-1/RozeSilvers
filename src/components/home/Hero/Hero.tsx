import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button/Button';
import styles from './Hero.module.css';

export function Hero() {
  const t = useTranslations('common');
  
  return (
    <section className={styles.hero}>
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #111 0%, #333 100%)',
          zIndex: 1
        }} 
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.title}>Elegance in Every Detail</h1>
        <p className={styles.subtitle}>Discover our new collection of premium sterling silver jewelry.</p>
        <Button href="/collections/all" variant="primary" size="large" style={{ backgroundColor: '#fff', color: '#111' }}>
          {t('shopNow')}
        </Button>
      </div>
    </section>
  );
}
