'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import styles from './ProductGallery.module.css';

interface ProductGalleryProps {
  images: any[];
  title: string;
  isOnSale?: boolean;
  saleLabel?: string;
}

export function ProductGallery({ images, title, isOnSale, saleLabel }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const locale = useLocale();
  const isRtl = locale === 'ar';

  if (!images || images.length === 0) {
    return <div className={styles.emptyImage} />;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    e.currentTarget.style.setProperty('--x', `${x}%`);
    e.currentTarget.style.setProperty('--y', `${y}%`);
  };

  return (
    <div className={styles.gallery}>
      <div 
        className={styles.mainImageContainer}
        onMouseMove={handleMouseMove}
      >
        {images.map((img, index) => {
          let positionClass = styles.slideActive;
          if (index < currentIndex) {
            positionClass = isRtl ? styles.slideNext : styles.slidePrev;
          } else if (index > currentIndex) {
            positionClass = isRtl ? styles.slidePrev : styles.slideNext;
          }

          return (
            <div key={img.url + index} className={`${styles.slide} ${positionClass}`}>
              <Image
                src={img.url}
                alt={img.altText || `${title} image ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.mainImage}
              />
            </div>
          );
        })}

        {isOnSale && (
          <div className={styles.saleBadge}>
            {saleLabel || 'SALE'}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, index) => (
            <button
              key={img.url + index}
              onClick={() => setCurrentIndex(index)}
              className={`${styles.thumbnailBtn} ${index === currentIndex ? styles.activeThumbnail : ''}`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${title} thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className={styles.thumbnailImage}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
