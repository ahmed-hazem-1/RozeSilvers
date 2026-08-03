import React from 'react';
import { useTranslations } from 'next-intl';
import { useAIChooser } from '../hooks/useAIChooser';
import { StepHeader } from './StepHeader';
import { JewelryCategory } from '../types';
import styles from './StepCategories.module.css';

export function StepCategories() {
  const t = useTranslations('aiChooser.step2');
  const { preferences, toggleCategory } = useAIChooser();

  const categories: { id: JewelryCategory; labelKey: string }[] = [
    { id: 'rings', labelKey: 'options.rings' },
    { id: 'necklaces', labelKey: 'options.necklaces' },
    { id: 'bracelets', labelKey: 'options.bracelets' },
    { id: 'earrings', labelKey: 'options.earrings' },
    { id: 'anklets', labelKey: 'options.anklets' },
  ];

  return (
    <div className={styles.stepContainer}>
      <StepHeader
        currentStep={2}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className={styles.grid}>
        {categories.map((cat) => {
          const isSelected = preferences.categories.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              className={`${styles.categoryCard} ${isSelected ? styles.categoryCardSelected : ''}`}
              onClick={() => toggleCategory(cat.id)}
            >
              <div className={styles.checkboxWrapper}>
                <div className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`}>
                  {isSelected && <span className={styles.checkmark}>✓</span>}
                </div>
              </div>
              <span className={styles.label}>{t(cat.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
