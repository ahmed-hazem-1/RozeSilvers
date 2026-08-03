import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './StepHeader.module.css';

interface StepHeaderProps {
  currentStep: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
}

export function StepHeader({
  currentStep,
  totalSteps = 4,
  title,
  subtitle,
}: StepHeaderProps) {
  const t = useTranslations('aiChooser.drawer');
  const progressPercent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div className={styles.container}>
      <div className={styles.metaRow}>
        <span className={styles.stepCounter}>
          {t('stepCounter', { current: currentStep, total: totalSteps })}
        </span>
        <span className={styles.percentage}>{progressPercent}%</span>
      </div>

      <div className={styles.progressBarTrack}>
        <div
          className={styles.progressBarFill}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <h3 className={styles.title}>{title}</h3>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
