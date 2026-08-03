'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { FiSearch, FiX, FiArrowRight, FiArrowLeft, FiLoader } from 'react-icons/fi';
import styles from './SearchBar.module.css';

export interface SearchProduct {
  id: string;
  title: string;
  handle: string;
  productType?: string;
  vendor?: string;
  availableForSale?: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  } | null;
  isOnSale: boolean;
  image?: {
    url: string;
    altText?: string;
  } | null;
}

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

export function SearchBar({ isOpen, onClose, isMobile = false }: SearchBarProps) {
  const t = useTranslations('search');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
      setResults([]);
      setHasSearched(false);
      setActiveIndex(-1);
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Live search debounced fetch
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      setHasSearched(false);
      setActiveIndex(-1);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=8`, {
          signal: controller.signal
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
          setHasSearched(true);
          setActiveIndex(-1);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Search fetch error:', err);
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        const selected = results[activeIndex];
        handleSelectProduct(selected.handle);
      } else if (results.length > 0) {
        handleSelectProduct(results[0].handle);
      }
    }
  };

  const handleSelectProduct = useCallback(
    (handle: string) => {
      onClose();
      router.push(`/products/${handle}`);
    },
    [onClose, router]
  );

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (keyword: string) => {
    setQuery(keyword);
    inputRef.current?.focus();
  };

  // Helper to highlight matching text in product title
  const renderHighlightedTitle = (title: string, searchTerm: string) => {
    if (!searchTerm.trim()) return title;
    const term = searchTerm.trim().toLowerCase();
    const lowerTitle = title.toLowerCase();
    const index = lowerTitle.indexOf(term);

    if (index === -1) return title;

    const before = title.substring(0, index);
    const match = title.substring(index, index + term.length);
    const after = title.substring(index + term.length);

    return (
      <>
        {before}
        <span className={styles.highlight}>{match}</span>
        {after}
      </>
    );
  };

  if (!isOpen) return null;

  const popularKeywords = isRtl
    ? ['خاتم', 'سلسلة', 'انسيال', 'حلق', 'فضة 925']
    : ['Ring', 'Necklace', 'Bracelet', 'Earrings', 'Silver 925'];

  return (
    <>
      {!isMobile && <div className={styles.backdrop} onClick={onClose} />}

      <div
        ref={containerRef}
        className={isMobile ? styles.mobileSearchContainer : styles.desktopSearchWrapper}
      >
        <div className={isMobile ? styles.mobileInputGroup : styles.inputGroup}>
          <div className={styles.searchIcon}>
            {isLoading ? (
              <FiLoader size={18} className={styles.spinner} />
            ) : (
              <FiSearch size={18} />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder={t('placeholder') || (isRtl ? 'ابحثي عن منتج...' : 'Search products...')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search products"
            autoComplete="off"
            spellCheck="false"
          />

          <div className={styles.inputActions}>
            {query.length > 0 && (
              <button
                type="button"
                className={styles.iconBtn}
                onClick={handleClear}
                aria-label={t('clear') || 'Clear'}
              >
                <FiX size={16} />
              </button>
            )}

            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              aria-label={t('close') || 'Close'}
            >
              {isMobile ? (
                isRtl ? <FiArrowRight size={20} /> : <FiArrowLeft size={20} />
              ) : (
                <FiX size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        <div className={`${styles.dropdown} ${isMobile ? styles.mobileDropdown : ''}`}>
          {/* Loading Skeletons */}
          {isLoading && results.length === 0 && (
            <div>
              {[1, 2, 3].map((n) => (
                <div key={n} className={styles.skeletonItem}>
                  <div className={styles.skeletonThumb} />
                  <div className={styles.skeletonTextGroup}>
                    <div className={styles.skeletonTitle} />
                    <div className={styles.skeletonPrice} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results List */}
          {!isLoading && results.length > 0 && (
            <>
              <div className={styles.dropdownHeader}>
                {t('products') || (isRtl ? 'المنتجات' : 'Products')} ({results.length})
              </div>
              <ul className={styles.productList} role="listbox">
                {results.map((product, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <li
                      key={product.id}
                      className={`${styles.productItem} ${isActive ? styles.productItemActive : ''}`}
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <Link
                        href={`/products/${product.handle}`}
                        className={styles.productLink}
                        onClick={() => {
                          onClose();
                        }}
                      >
                        <div className={styles.thumbnailContainer}>
                          {product.image?.url ? (
                            <Image
                              src={product.image.url}
                              alt={product.image.altText || product.title}
                              fill
                              sizes="52px"
                              className={styles.thumbnail}
                            />
                          ) : (
                            <div className={styles.thumbnailPlaceholder}>
                              <FiSearch size={18} />
                            </div>
                          )}
                        </div>

                        <div className={styles.productInfo}>
                          <h4 className={styles.productTitle}>
                            {renderHighlightedTitle(product.title, query)}
                          </h4>
                          <div className={styles.productMeta}>
                            <div className={styles.priceContainer}>
                              {product.isOnSale && product.compareAtPrice && (
                                <span className={styles.originalPrice}>
                                  {parseFloat(product.compareAtPrice.amount).toLocaleString(
                                    undefined,
                                    {
                                      style: 'currency',
                                      currency: product.compareAtPrice.currencyCode || 'EGP',
                                      maximumFractionDigits: 0
                                    }
                                  )}
                                </span>
                              )}
                              <span
                                className={
                                  product.isOnSale ? styles.salePrice : styles.price
                                }
                              >
                                {parseFloat(product.price.amount).toLocaleString(
                                  undefined,
                                  {
                                    style: 'currency',
                                    currency: product.price.currencyCode || 'EGP',
                                    maximumFractionDigits: 0
                                  }
                                )}
                              </span>
                            </div>
                            {product.isOnSale && (
                              <span className={styles.saleBadge}>
                                {isRtl ? 'خصم' : 'SALE'}
                              </span>
                            )}
                            {product.productType && (
                              <span className={styles.categoryTag}>
                                {product.productType}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={styles.arrowIcon}>
                          {isRtl ? <FiArrowLeft size={16} /> : <FiArrowRight size={16} />}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className={styles.viewAllFooter}>
                <Link
                  href="/collections/all"
                  className={styles.viewAllLink}
                  onClick={onClose}
                >
                  <span>{t('viewAll') || (isRtl ? 'عرض كل المنتجات' : 'View all products')}</span>
                  {isRtl ? <FiArrowLeft size={14} /> : <FiArrowRight size={14} />}
                </Link>
              </div>
            </>
          )}

          {/* Empty Results State */}
          {!isLoading && hasSearched && results.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiSearch size={22} />
              </div>
              <p className={styles.emptyTitle}>
                {t('noResults') || (isRtl ? 'لا توجد نتائج لـ' : 'No products found for')}{' '}
                &ldquo;<strong>{query}</strong>&rdquo;
              </p>
              <p className={styles.emptySubtitle}>
                {t('noResultsTip') ||
                  (isRtl
                    ? 'جربي البحث بكلمة مختلفة أو تصفحي أحد الأقسام التالية'
                    : 'Try searching for a different keyword or explore our collections')}
              </p>
              <div className={styles.suggestionsSection}>
                <span className={styles.suggestionsTitle}>
                  {t('popularSearches') || (isRtl ? 'عمليات البحث الشائعة' : 'Popular Searches')}
                </span>
                <div className={styles.suggestionChips}>
                  {popularKeywords.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={styles.chipBtn}
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Initial State (Before Typing) */}
          {!isLoading && !hasSearched && query.length === 0 && (
            <div className={styles.suggestionsSection} style={{ borderTop: 'none', marginTop: 0 }}>
              <span className={styles.suggestionsTitle}>
                {t('popularSearches') || (isRtl ? 'عمليات البحث الشائعة' : 'Popular Searches')}
              </span>
              <div className={styles.suggestionChips}>
                {popularKeywords.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={styles.chipBtn}
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
