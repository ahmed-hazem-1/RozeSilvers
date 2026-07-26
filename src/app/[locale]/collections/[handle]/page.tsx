import { ProductGrid } from '@/components/product/ProductGrid/ProductGrid';
import { shopifyFetch } from '@/lib/shopify/client';
import { getCollectionQuery, getAllProductsQuery } from '@/lib/shopify/queries';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

export default async function CollectionPage({
  params
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { handle } = await params;
  const t = await getTranslations('collection');

  let collection;
  let products = [];
  try {
    if (handle === 'all') {
      const { body } = await shopifyFetch<any>({
        query: getAllProductsQuery,
        variables: { first: 30 }
      });
      products = body?.data?.products?.edges || [];
    } else {
      const { body } = await shopifyFetch<any>({
        query: getCollectionQuery,
        variables: {
          handle,
          first: 30
        }
      });
      collection = body?.data?.collection;
      products = collection?.products?.edges || [];
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{collection?.title || (handle === 'all' ? 'All Products' : 'Collection')}</h1>
        {collection?.description && (
          <p className={styles.description}>{collection.description}</p>
        )}
      </div>

      <div className={styles.controls}>
        <button>{t('filter')}</button>
        <button>{t('sort')}</button>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
