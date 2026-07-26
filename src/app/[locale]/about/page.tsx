import { getTranslations } from 'next-intl/server';
import styles from '../static.module.css';

export default async function AboutPage() {
  const t = await getTranslations('about');
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <div className={styles.content}>
        <p>{t('intro')}</p>
        <h2>{t('craftsmanship')}</h2>
        <p>{t('craftsmanshipText')}</p>
        <h2>{t('mission')}</h2>
        <p>{t('missionText')}</p>
      </div>
    </div>
  );
}
