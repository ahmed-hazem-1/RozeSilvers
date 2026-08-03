import React from 'react';
import { useTranslations } from 'next-intl';
import { useAIChooser } from '../hooks/useAIChooser';
import { StepHeader } from './StepHeader';
import { BudgetRange } from '../types';
import styles from './StepBudget.module.css';

export function StepBudget() {
  const t = useTranslations('aiChooser.step4');
  const { preferences, setBudget } = useAIChooser();

  const budgets: { id: BudgetRange; labelKey: string }[] = [
    { id: 'under600', labelKey: 'options.under600' },
    { id: '600to1500', labelKey: 'options.600to1500' },
    { id: 'above1500', labelKey: 'options.above1500' },
    { id: 'any', labelKey: 'options.any' },
  ];

  return (
    <div className={styles.stepContainer}>
      <StepHeader
        currentStep={4}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className={styles.grid}>
        {budgets.map((b) => {
          const isSelected = preferences.budget === b.id;
          return (
            <button
              key={b.id}
              type="button"
              className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
              onClick={() => setBudget(b.id)}
            >
              <span className={styles.label}>{t(b.labelKey)}</span>
              {isSelected && <span className={styles.indicator}>✦</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
