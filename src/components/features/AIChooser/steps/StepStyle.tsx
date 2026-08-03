import React from 'react';
import { useTranslations } from 'next-intl';
import { useAIChooser } from '../hooks/useAIChooser';
import { StepHeader } from './StepHeader';
import { StyleVibe } from '../types';
import styles from './StepStyle.module.css';

export function StepStyle() {
  const t = useTranslations('aiChooser.step3');
  const { preferences, setStyle } = useAIChooser();

  const stylesList: { id: StyleVibe; labelKey: string }[] = [
    { id: 'minimal', labelKey: 'options.minimal' },
    { id: 'classic', labelKey: 'options.classic' },
    { id: 'statement', labelKey: 'options.statement' },
    { id: 'zircon', labelKey: 'options.zircon' },
  ];

  return (
    <div className={styles.stepContainer}>
      <StepHeader
        currentStep={3}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className={styles.grid}>
        {stylesList.map((st) => {
          const isSelected = preferences.style === st.id;
          return (
            <button
              key={st.id}
              type="button"
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
              onClick={() => setStyle(st.id)}
            >
              <div className={styles.cardContent}>
                <span className={styles.title}>{t(st.labelKey)}</span>
              </div>
              {isSelected && <span className={styles.indicator}>✦</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
