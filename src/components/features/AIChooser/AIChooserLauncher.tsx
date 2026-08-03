'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useAIChooser } from './hooks/useAIChooser';
import styles from './AIChooserLauncher.module.css';

export function AIChooserLauncher() {
  const t = useTranslations('aiChooser.launcher');
  const { openDrawer } = useAIChooser();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <button
      type="button"
      className={styles.launcherBtn}
      onClick={openDrawer}
      aria-label={t('tooltip')}
      title={t('tooltip')}
    >
      <span className={styles.sparkle}>✦</span>
      <span className={styles.btnText}>{t('buttonText')}</span>
    </button>
  );
}
