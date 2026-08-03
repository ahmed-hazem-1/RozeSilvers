'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FiX } from 'react-icons/fi';
import { useAIChooser } from './hooks/useAIChooser';
import { Button } from '@/components/ui/Button/Button';
import styles from './WelcomePromptModal.module.css';

const STORAGE_KEY = 'roze_ai_chooser_prompt_dismissed';

export function WelcomePromptModal() {
  const t = useTranslations('aiChooser.prompt');
  const { openDrawer, isOpen: isDrawerOpen } = useAIChooser();
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 3500); // 3.5s delay

        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const handleStart = () => {
    handleDismiss();
    openDrawer();
  };

  if (!isMounted) return null;

  const shouldShow = isVisible && !isDrawerOpen;

  return (
    <div
      className={`${styles.container} ${shouldShow ? styles.visible : styles.hidden}`}
      role="dialog"
      aria-labelledby="ai-prompt-title"
      aria-hidden={!shouldShow}
    >
      <button
        type="button"
        className={styles.closeBtn}
        onClick={handleDismiss}
        aria-label="Dismiss"
      >
        <FiX size={16} />
      </button>

      <div className={styles.content}>
        <div className={styles.badge}>✦ AI Concierge</div>
        <h4 id="ai-prompt-title" className={styles.title}>
          {t('title')}
        </h4>
        <p className={styles.subtitle}>{t('subtitle')}</p>

        <div className={styles.actions}>
          <Button variant="primary" size="default" onClick={handleStart}>
            {t('ctaStart')}
          </Button>
          <button type="button" className={styles.dismissBtn} onClick={handleDismiss}>
            {t('ctaDismiss')}
          </button>
        </div>
      </div>
    </div>
  );
}

