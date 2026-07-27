import { ProductGrid } from '@/components/product/ProductGrid/ProductGrid';
import { shopifyFetch } from '@/lib/shopify/client';
import { getCollectionQuery, getSearchProductsQuery } from '@/lib/shopify/queries';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { CollectionFilters } from '@/components/collection/CollectionFilters/CollectionFilters';

export default async function CollectionPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string; handle: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { handle } = await params;
  const sp = await searchParams;
  const t = await getTranslations('collection');

  const sort = typeof sp.sort === 'string' ? sp.sort : '';
  let sortKey = handle === 'all' ? 'RELEVANCE' : 'COLLECTION_DEFAULT';
  let reverse = false;

  switch (sort) {
    case 'price-asc':
      sortKey = 'PRICE';
      reverse = false;
      break;
    case 'price-desc':
      sortKey = 'PRICE';
      reverse = true;
      break;
    case 'newest':
      sortKey = handle === 'all' ? 'RELEVANCE' : 'CREATED';
      reverse = handle === 'all' ? false : true;
      break;
    case 'best-selling':
      sortKey = handle === 'all' ? 'RELEVANCE' : 'BEST_SELLING';
      reverse = false;
      break;
    default:
      break;
  }

  // Parse filters from searchParams
  const filters: any[] = [];
  
  if (sp.available === 'true') {
    filters.push({ available: true });
  }

  if (sp.minPrice || sp.maxPrice) {
    const priceFilter: any = {};
    if (sp.minPrice) priceFilter.min = parseFloat(sp.minPrice as string);
    if (sp.maxPrice) priceFilter.max = parseFloat(sp.maxPrice as string);
    filters.push({ price: priceFilter });
  }
  
  if (sp.productType) {
    const types = Array.isArray(sp.productType) ? sp.productType : sp.productType.split(',');
    types.forEach(type => filters.push({ productType: type }));
  }

  let collection;
  let products = [];
  let availableFilters = [];

  try {
    if (handle === 'all') {
      const { body } = await shopifyFetch<any>({
        query: getSearchProductsQuery,
        variables: {
          first: 30,
          sortKey: sortKey === 'COLLECTION_DEFAULT' ? 'RELEVANCE' : sortKey,
          reverse,
          productFilters: filters.length > 0 ? filters : undefined
        }
      });
      availableFilters = body?.data?.search?.productFilters || [];
      products = body?.data?.search?.edges || [];
    } else {
      const { body } = await shopifyFetch<any>({
        query: getCollectionQuery,
        variables: {
          handle,
          first: 30,
          sortKey: sortKey === 'RELEVANCE' ? 'COLLECTION_DEFAULT' : sortKey,
          reverse,
          filters: filters.length > 0 ? filters : undefined
        }
      });
      collection = body?.data?.collection;
      products = collection?.products?.edges || [];
      availableFilters = collection?.products?.filters || [];
      if (!collection) {
        notFound();
      }
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{collection?.title || (handle === 'all' ? t('allProducts') || 'All Products' : 'Collection')}</h1>
        {collection?.description && (
          <p className={styles.description}>{collection.description}</p>
        )}
      </div>

      <CollectionFilters availableFilters={availableFilters} />

      {products.length === 0 ? (
        <div className={styles.noProducts}>
          <p>{t('noProducts') || 'No products found matching your criteria.'}</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
