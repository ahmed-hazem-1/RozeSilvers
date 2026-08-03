'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useAIChooser } from '../hooks/useAIChooser';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button/Button';
import styles from './ResultsView.module.css';

export function ResultsView() {
  const t = useTranslations('aiChooser.results');
  const { results, resetQuiz, closeDrawer } = useAIChooser();
  const { addCartItem } = useCart();

  const [addingPrimary, setAddingPrimary] = useState(false);
  const [primaryAdded, setPrimaryAdded] = useState(false);
  const [addingBundle, setAddingBundle] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);

  if (!results || !results.products || results.products.length === 0) {
    return null;
  }

  const primaryProduct = results.products[0];
  const pairingProduct = primaryProduct.suggestedPairing || (results.products.length > 1 ? results.products[1] : null);

  const handleAddPrimary = async () => {
    if (!primaryProduct.variantId) return;
    setAddingPrimary(true);
    try {
      await addCartItem(primaryProduct.variantId, 1);
      setPrimaryAdded(true);
      setTimeout(() => setPrimaryAdded(false), 2500);
    } catch (e) {
      console.error('Error adding primary to cart:', e);
    } finally {
      setAddingPrimary(false);
    }
  };

  const handleAddBundle = async () => {
    if (!primaryProduct.variantId) return;
    setAddingBundle(true);
    try {
      await addCartItem(primaryProduct.variantId, 1);
      if (pairingProduct?.variantId) {
        await addCartItem(pairingProduct.variantId, 1);
      }
      setBundleAdded(true);
      setTimeout(() => setBundleAdded(false), 2500);
    } catch (e) {
      console.error('Error adding bundle to cart:', e);
    } finally {
      setAddingBundle(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header section */}
      <div className={styles.header}>
        <div className={styles.badge}>✦ AI Concierge Selection</div>
        <h3 className={styles.title}>{t('title')}</h3>
        <p className={styles.subtitle}>{results.recommendationSummary || t('subtitle')}</p>
      </div>

      {/* Top Primary Product Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.matchScore}>
            {t('matchScore', { score: primaryProduct.matchScore || 96 })}
          </span>
        </div>

        <div className={styles.productRow}>
          {primaryProduct.imageUrl && (
            <div className={styles.imageContainer}>
              <Image
                src={primaryProduct.imageUrl}
                alt={primaryProduct.title}
                fill
                sizes="120px"
                className={styles.image}
              />
            </div>
          )}

          <div className={styles.productDetails}>
            <h4 className={styles.productTitle}>{primaryProduct.title}</h4>
            {primaryProduct.price && (
              <div className={styles.priceContainer}>
                {primaryProduct.compareAtPrice && (
                  <span className={styles.originalPrice}>
                    {parseFloat(primaryProduct.compareAtPrice.amount).toLocaleString(undefined, {
                      style: 'currency',
                      currency: primaryProduct.compareAtPrice.currencyCode,
                    })}
                  </span>
                )}
                <span className={styles.price}>
                  {parseFloat(primaryProduct.price.amount).toLocaleString(undefined, {
                    style: 'currency',
                    currency: primaryProduct.price.currencyCode,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* AI Rationale */}
        {primaryProduct.reason && (
          <div className={styles.rationaleBox}>
            <span className={styles.rationaleTitle}>✦ {t('whyWeChoseThis')}</span>
            <p className={styles.rationaleText}>{primaryProduct.reason}</p>
          </div>
        )}

        <div className={styles.actionButtons}>
          <Button
            variant="primary"
            fullWidth
            onClick={handleAddPrimary}
            disabled={addingPrimary || !primaryProduct.variantId}
          >
            {addingPrimary ? '...' : primaryAdded ? t('addedToCart') : t('addToCart')}
          </Button>

          <Link
            href={`/products/${primaryProduct.handle}`}
            onClick={closeDrawer}
            className={styles.viewLink}
          >
            {t('viewProduct')} →
          </Link>
        </div>
      </div>

      {/* Suggested Pairing Bundle Card */}
      {pairingProduct && (
        <div className={styles.bundleCard}>
          <div className={styles.bundleBadge}>
            ✦ {t('pairingTitle')}
          </div>
          
          <div className={styles.pairingRow}>
            {pairingProduct.imageUrl && (
              <div className={styles.pairingImageContainer}>
                <Image
                  src={pairingProduct.imageUrl}
                  alt={pairingProduct.title}
                  fill
                  sizes="64px"
                  className={styles.image}
                />
              </div>
            )}
            <div className={styles.pairingInfo}>
              <h5 className={styles.pairingTitle}>{pairingProduct.title}</h5>
              {pairingProduct.price && (
                <span className={styles.pairingPrice}>
                  {parseFloat(pairingProduct.price.amount).toLocaleString(undefined, {
                    style: 'currency',
                    currency: pairingProduct.price.currencyCode,
                  })}
                </span>
              )}
            </div>
          </div>

          <Button
            variant="secondary"
            fullWidth
            onClick={handleAddBundle}
            disabled={addingBundle || !primaryProduct.variantId}
          >
            {addingBundle ? t('addingBundle') : bundleAdded ? t('bundleAdded') : t('addBundle')}
          </Button>
        </div>
      )}

      {/* Gift Card Note Suggestion */}
      {results.giftNoteSuggestion && (
        <div className={styles.giftNoteCard}>
          <span className={styles.giftNoteHeader}>💌 {t('giftNote')}</span>
          <p className={styles.giftNoteQuote}>
            &ldquo;{results.giftNoteSuggestion}&rdquo;
          </p>
        </div>
      )}

      {/* Retake Button */}
      <button type="button" className={styles.retakeBtn} onClick={resetQuiz}>
        ↻ {t('retake')}
      </button>
    </div>
  );
}
