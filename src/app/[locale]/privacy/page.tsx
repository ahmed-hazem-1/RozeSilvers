import { getTranslations } from 'next-intl/server';
import styles from '../static.module.css';

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <div className={styles.content}>
        <p>{t('updated')}</p>
        
        <h2>{t('info')}</h2>
        <p>{t('infoText')}</p>
        
        <h2>{t('use')}</h2>
        <p>{t('useText')}</p>

        <h2>{t('security')}</h2>
        <p>{t('securityText')}</p>
      </div>
    </div>
  );
}
