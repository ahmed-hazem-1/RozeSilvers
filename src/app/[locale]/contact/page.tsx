import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/Button/Button';
import styles from '../static.module.css';

export default async function ContactPage() {
  const t = await getTranslations('contact');
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <div className={styles.content}>
        <p style={{ textAlign: 'center' }}>
          {t('subtitle')}
        </p>

        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>{t('name')}</label>
            <input type="text" id="name" className={styles.input} required />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>{t('email')}</label>
            <input type="email" id="email" className={styles.input} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>{t('message')}</label>
            <textarea id="message" className={styles.textarea} required></textarea>
          </div>

          <Button type="submit" variant="primary" size="large">{t('submit')}</Button>
        </form>
      </div>
    </div>
  );
}
