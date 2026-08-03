'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { FiX, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { useAIChooser } from './hooks/useAIChooser';
import { StepRecipient } from './steps/StepRecipient';
import { StepCategories } from './steps/StepCategories';
import { StepStyle } from './steps/StepStyle';
import { StepBudget } from './steps/StepBudget';
import { ResultsView } from './steps/ResultsView';
import { Button } from '@/components/ui/Button/Button';
import styles from './AIChooserDrawer.module.css';

export function AIChooserDrawer() {
  const t = useTranslations('aiChooser');
  const td = useTranslations('aiChooser.drawer');
  const te = useTranslations('aiChooser.errors');
  const [isMounted, setIsMounted] = React.useState(false);
  const {
    isOpen,
    closeDrawer,
    currentStep,
    nextStep,
    prevStep,
    isLoading,
    error,
    submitQuiz,
    canProceed,
  } = useAIChooser();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeDrawer();
    }
  };

  if (!isMounted) return null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepRecipient />;
      case 2:
        return <StepCategories />;
      case 3:
        return <StepStyle />;
      case 4:
        return <StepBudget />;
      case 5:
        return <ResultsView />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={handleBackdropClick}
        aria-hidden={!isOpen}
      />

      {/* Sliding Luxury Drawer Container */}
      <div
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={td('headerTitle')}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <span className={styles.sparkleIcon}>✦</span>
            <h2 className={styles.headerTitle}>{td('headerTitle')}</h2>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={closeDrawer}
            aria-label={td('close')}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body content */}
        <div className={styles.body}>
          {isLoading ? (
            <div key="loading" className={styles.loadingContainer}>
              <div className={styles.spinner} />
              <h3 className={styles.loadingTitle}>{td('loadingTitle')}</h3>
              <p className={styles.loadingSubtitle}>{td('loadingSubtitle')}</p>
            </div>
          ) : error ? (
            <div key="error" className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error || te('general')}</p>
              <Button variant="primary" onClick={submitQuiz}>
                {te('retry')}
              </Button>
            </div>
          ) : (
            <div key={`step-${currentStep}`} style={{ width: '100%' }}>
              {renderStep()}
            </div>
          )}
        </div>

        {/* Footer Navigation (Steps 1 to 4) */}
        {!isLoading && !error && currentStep < 5 && (
          <div className={styles.footer}>
            {currentStep > 1 ? (
              <button
                type="button"
                className={styles.backButton}
                onClick={prevStep}
              >
                <span className={styles.arrowIconStart}>←</span>
                <span>{td('back')}</span>
              </button>
            ) : (
              <div />
            )}

            <Button
              variant="primary"
              onClick={nextStep}
              disabled={!canProceed || isLoading}
              className={styles.nextButton}
            >
              <span>{currentStep === 4 ? td('submit') : td('next')}</span>
              {currentStep < 4 && <span className={styles.arrowIconEnd}>→</span>}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
