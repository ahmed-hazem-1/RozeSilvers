'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { FiFilter, FiX, FiChevronDown, FiCheck } from 'react-icons/fi';
import { Button } from '@/components/ui/Button/Button';
import styles from './CollectionFilters.module.css';

interface FilterValue {
  id: string;
  label: string;
  count: number;
  input: string;
}

interface Filter {
  id: string;
  label: string;
  type: 'LIST' | 'PRICE_RANGE' | 'BOOLEAN' | string;
  values: FilterValue[];
}

interface CollectionFiltersProps {
  availableFilters: Filter[];
}

export function CollectionFilters({ availableFilters }: CollectionFiltersProps) {
  const t = useTranslations('collection');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  
  // Local state for filters before applying
  const [localTypes, setLocalTypes] = useState<string[]>([]);
  const [localMinPrice, setLocalMinPrice] = useState<string>('');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>('');
  const [localInStock, setLocalInStock] = useState<boolean>(false);

  // Initialize local state from URL on mount and when searchParams change
  useEffect(() => {
    const pt = searchParams.get('productType');
    if (pt) {
      setLocalTypes(pt.split(','));
    } else {
      setLocalTypes([]);
    }
    setLocalMinPrice(searchParams.get('minPrice') || '');
    setLocalMaxPrice(searchParams.get('maxPrice') || '');
    setLocalInStock(searchParams.get('available') === 'true');
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSort = searchParams.get('sort') || '';

  const sortOptions = [
    { value: '', label: t('sortFeatured') || 'Featured' },
    { value: 'price-asc', label: t('sortPriceLow') || 'Price: Low to High' },
    { value: 'price-desc', label: t('sortPriceHigh') || 'Price: High to Low' },
    { value: 'newest', label: t('sortNewest') || 'Newest' },
    { value: 'best-selling', label: t('sortBestSelling') || 'Best Selling' },
  ];

  const currentSortLabel = sortOptions.find(o => o.value === currentSort)?.label || sortOptions[0].label;

  const handleSortSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    router.push(`${pathname}?${params.toString()}`);
    setIsSortOpen(false);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (localTypes.length > 0) {
      params.set('productType', localTypes.join(','));
    } else {
      params.delete('productType');
    }

    if (localMinPrice) {
      params.set('minPrice', localMinPrice);
    } else {
      params.delete('minPrice');
    }

    if (localMaxPrice) {
      params.set('maxPrice', localMaxPrice);
    } else {
      params.delete('maxPrice');
    }

    if (localInStock) {
      params.set('available', 'true');
    } else {
      params.delete('available');
    }

    router.push(`${pathname}?${params.toString()}`);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setLocalTypes([]);
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setLocalInStock(false);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete('productType');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('available');
    
    router.push(`${pathname}?${params.toString()}`);
    setIsFilterOpen(false);
  };

  const toggleType = (typeValue: string) => {
    setLocalTypes(prev => 
      prev.includes(typeValue) 
        ? prev.filter(t => t !== typeValue)
        : [...prev, typeValue]
    );
  };

  return (
    <>
      <div className={styles.controlsBar}>
        <button className={styles.filterBtn} onClick={() => setIsFilterOpen(true)}>
          <FiFilter size={18} />
          {t('filter') || 'Filter'}
        </button>

        <div className={styles.sortContainer}>
          <label className={styles.sortLabel}>{t('sort') || 'Sort'}:</label>
          <div className={styles.customSelectWrapper} ref={sortRef}>
            <button 
              className={styles.customSelectTrigger} 
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              <span>{currentSortLabel}</span>
              <FiChevronDown className={`${styles.selectIcon} ${isSortOpen ? styles.selectIconOpen : ''}`} size={16} />
            </button>
            {isSortOpen && (
              <div className={styles.customSelectMenu}>
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    className={`${styles.customSelectOption} ${currentSort === option.value ? styles.customSelectOptionActive : ''}`}
                    onClick={() => handleSortSelect(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <div 
        className={`${styles.overlay} ${isFilterOpen ? styles.overlayOpen : ''}`} 
        onClick={() => setIsFilterOpen(false)}
      />
      <div className={`${styles.drawer} ${isFilterOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.drawerHeader}>
          <h2>{t('filter') || 'Filters'}</h2>
          <button onClick={() => setIsFilterOpen(false)} className={styles.closeBtn}>
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.drawerContent}>
          {availableFilters.map(filter => {
            if (filter.type === 'LIST' && filter.id === 'filter.p.product_type') {
              return (
                <div key={filter.id} className={styles.filterGroup}>
                  <h3 className={styles.filterTitle}>{filter.label}</h3>
                  <div className={styles.checkboxList}>
                    {filter.values.map(val => (
                      <label key={val.id} className={styles.checkboxLabel}>
                        <div className={`${styles.checkbox} ${localTypes.includes(val.label) ? styles.checkboxChecked : ''}`}>
                          {localTypes.includes(val.label) && <FiCheck size={12} />}
                        </div>
                        <input 
                          type="checkbox" 
                          checked={localTypes.includes(val.label)}
                          onChange={() => toggleType(val.label)}
                          className={styles.hiddenInput}
                        />
                        <span className={styles.checkboxText}>{val.label} ({val.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            }
            
            if (filter.type === 'PRICE_RANGE') {
              return (
                <div key={filter.id} className={styles.filterGroup}>
                  <h3 className={styles.filterTitle}>{filter.label || t('priceRange')}</h3>
                  <div className={styles.priceInputs}>
                    <div className={styles.inputGroup}>
                      <span className={styles.currencySymbol}>$</span>
                      <input 
                        type="number" 
                        placeholder="Min" 
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                        className={styles.priceInput}
                      />
                    </div>
                    <span>-</span>
                    <div className={styles.inputGroup}>
                      <span className={styles.currencySymbol}>$</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                        className={styles.priceInput}
                      />
                    </div>
                  </div>
                </div>
              );
            }
            
            if (filter.type === 'BOOLEAN' && filter.id === 'filter.v.availability') {
              return (
                <div key={filter.id} className={styles.filterGroup}>
                  <label className={styles.checkboxLabel}>
                    <div className={`${styles.checkbox} ${localInStock ? styles.checkboxChecked : ''}`}>
                      {localInStock && <FiCheck size={12} />}
                    </div>
                    <input 
                      type="checkbox" 
                      checked={localInStock}
                      onChange={(e) => setLocalInStock(e.target.checked)}
                      className={styles.hiddenInput}
                    />
                    <span className={styles.checkboxText}>{t('inStock') || 'In Stock Only'}</span>
                  </label>
                </div>
              );
            }

            return null;
          })}
        </div>

        <div className={styles.drawerFooter}>
          <button className={styles.clearBtn} onClick={handleClearFilters}>
            {t('clearAll') || 'Clear All'}
          </button>
          <Button variant="primary" onClick={handleApplyFilters}>
            {t('applyFilters') || 'Apply'}
          </Button>
        </div>
      </div>
    </>
  );
}
