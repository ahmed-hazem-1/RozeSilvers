import { shopifyFetch } from '@/lib/shopify/client';
import { getProductQuery, getCollectionQuery } from '@/lib/shopify/queries';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button/Button';
import { ProductGrid } from '@/components/product/ProductGrid/ProductGrid';
import { AddToCartButton } from '@/components/product/AddToCartButton/AddToCartButton';
import { WishlistButton } from '@/components/product/WishlistButton/WishlistButton';
import { ProductGallery } from '@/components/product/ProductGallery/ProductGallery';
import { Link } from '@/i18n/routing';
import { FiPackage } from 'react-icons/fi';
import styles from './page.module.css';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; handle: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const handle = decodeURIComponent(resolvedParams.handle);
  let product;
  try {
    const { body } = await shopifyFetch<any>({
      query: getProductQuery,
      variables: { handle }
    });
    product = body?.data?.product;
  } catch (e) {
    console.error(e);
  }

  if (!product) return {};

  return {
    title: `${product.title} — Rose Silvers`,
    description: product.description?.slice(0, 155),
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const resolvedParams = await params;
  const handle = decodeURIComponent(resolvedParams.handle);
  const t = await getTranslations('product');

  let product;
  try {
    const { body } = await shopifyFetch<any>({
      query: getProductQuery,
      variables: { handle }
    });
    product = body?.data?.product;
  } catch (e) {
    console.error(e);
  }

  if (!product) {
    return (
      <div className={styles.notFoundContainer}>
        <FiPackage size={64} className={styles.notFoundIcon} />
        <h1 className={styles.notFoundTitle}>{t('notFoundTitle')}</h1>
        <p className={styles.notFoundText}>
          {t('notFoundText')}
        </p>
        <Link href="/collections" className={styles.backBtn}>
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  let recommended = [];
  try {
    const res = await shopifyFetch<any>({
      query: getCollectionQuery,
      variables: { handle: 'frontpage', first: 4 }
    });
    recommended = res.body?.data?.collection?.products?.edges || [];
  } catch (e) {
    console.error('Error fetching recommended:', e);
  }

  const imageUrl = product?.images?.edges[0]?.node?.url;
  const price = product?.priceRange?.minVariantPrice;
  const compareAtPrice = product?.compareAtPriceRange?.minVariantPrice;
  const isOnSale = compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price?.amount || '0');

  const jsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images?.edges.map((e: any) => e.node.url) || [],
    description: product.description,
    brand: { '@type': 'Brand', name: 'Rose Silvers' },
    offers: {
      '@type': 'Offer',
      priceCurrency: price?.currencyCode || 'EGP',
      price: price?.amount || '0',
      availability: 'https://schema.org/InStock',
      url: `https://rosesilvers.com/${(await params).locale}/products/${handle}`
    }
  } : null;

  return (
    <div className={styles.page}>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <div className={styles.grid}>
        
        {/* Image Column */}
        <div className={styles.imageColumn}>
          <ProductGallery 
            images={product?.images?.edges.map((e: any) => e.node) || []} 
            title={product?.title || 'Product'} 
            isOnSale={isOnSale} 
            saleLabel={t('sale') || 'SALE'}
          />

          
          <div className={styles.formContainer}>
            <AddToCartButton 
              variantId={product?.variants?.edges[0]?.node?.id} 
              label={t('addToCart')} 
            />
            <WishlistButton handle={handle} variant="button" />
          </div>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: 'var(--space-xs)' }}>
            <h1 className={styles.title} style={{ marginBottom: 0 }}>{product?.title || 'Product Title'}</h1>
            <WishlistButton handle={handle} variant="icon" />
          </div>

          {price ? (
            <div className={styles.priceContainer}>
              {isOnSale && (
                <span className={styles.originalPrice}>
                  {parseFloat(compareAtPrice.amount).toLocaleString(undefined, {
                    style: 'currency',
                    currency: compareAtPrice.currencyCode
                  })}
                </span>
              )}
              <span className={isOnSale ? styles.salePrice : styles.price}>
                {parseFloat(price.amount).toLocaleString(undefined, {
                  style: 'currency',
                  currency: price.currencyCode
                })}
              </span>
            </div>
          ) : (
            <p className={styles.price}>$0.00</p>
          )}

          <div 
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: product?.descriptionHtml || 'Product description goes here.' }}
          />

          {/* Details Accordion */}
          <div className={styles.accordion}>
            <div className={styles.accordionItem}>
              <div className={styles.accordionTitle}>{t('details')} <span>+</span></div>
            </div>
            <div className={styles.accordionItem}>
              <div className={styles.accordionTitle}>{t('shipping')} <span>+</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      {recommended.length > 0 && (
        <section className={styles.recommended}>
          <h2 className={styles.sectionTitle}>{t('relatedProducts') || 'You May Also Like'}</h2>
          <ProductGrid products={recommended} />
        </section>
      )}
    </div>
  );
}
