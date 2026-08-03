import React from 'react';
import { useTranslations } from 'next-intl';
import { useAIChooser } from '../hooks/useAIChooser';
import { StepHeader } from './StepHeader';
import { RecipientType, OccasionType } from '../types';
import styles from './StepRecipient.module.css';

export function StepRecipient() {
  const t = useTranslations('aiChooser.step1');
  const { preferences, setRecipient, setOccasion } = useAIChooser();

  const recipientOptions: { id: RecipientType; labelKey: string }[] = [
    { id: 'self', labelKey: 'options.self' },
    { id: 'partner', labelKey: 'options.partner' },
    { id: 'mother', labelKey: 'options.mother' },
    { id: 'friend', labelKey: 'options.friend' },
  ];

  const occasionOptions: { id: OccasionType; labelKey: string }[] = [
    { id: 'everyday', labelKey: 'options.everyday' },
    { id: 'anniversary', labelKey: 'options.anniversary' },
    { id: 'birthday', labelKey: 'options.birthday' },
    { id: 'specialGift', labelKey: 'options.specialGift' },
  ];

  return (
    <div className={styles.stepContainer}>
      <StepHeader
        currentStep={1}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className={styles.section}>
        <span className={styles.sectionLabel}>{t('recipientLabel')}</span>
        <div className={styles.grid}>
          {recipientOptions.map((opt) => {
            const isSelected = preferences.recipient === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                onClick={() => setRecipient(opt.id)}
              >
                <span className={styles.chipText}>{t(opt.labelKey)}</span>
                {isSelected && <span className={styles.indicator}>✦</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <span className={styles.sectionLabel}>{t('occasionLabel')}</span>
        <div className={styles.grid}>
          {occasionOptions.map((opt) => {
            const isSelected = preferences.occasion === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
                onClick={() => setOccasion(opt.id)}
              >
                <span className={styles.chipText}>{t(opt.labelKey)}</span>
                {isSelected && <span className={styles.indicator}>✦</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
