import { getTranslations } from 'next-intl/server';
import styles from '../static.module.css';

export default async function ShippingPage() {
  const t = await getTranslations('shipping');
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <div className={styles.content}>
        <h2>{t('processing')}</h2>
        <p>{t('processingText')}</p>
        
        <h2>{t('rates')}</h2>
        <p>{t('ratesText')}</p>
        <ul>
          <li><strong>{t('standard')}</strong> {t('standardTime')}</li>
          <li><strong>{t('express')}</strong> {t('expressTime')}</li>
        </ul>

        <h2>{t('international')}</h2>
        <p>{t('internationalText')}</p>
      </div>
    </div>
  );
}
