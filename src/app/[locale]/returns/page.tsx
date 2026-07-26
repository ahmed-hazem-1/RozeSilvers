import { getTranslations } from 'next-intl/server';
import styles from '../static.module.css';

export default async function ReturnsPage() {
  const t = await getTranslations('returns');
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <div className={styles.content}>
        <h2>{t('policy')}</h2>
        <p>{t('policyText')}</p>
        
        <h2>{t('conditions')}</h2>
        <ul>
          <li>{t('cond1')}</li>
          <li>{t('cond2')}</li>
          <li>{t('cond3')}</li>
        </ul>

        <h2>{t('how')}</h2>
        <p>{t('howText')}</p>
      </div>
    </div>
  );
}
