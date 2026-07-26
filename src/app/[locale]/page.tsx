import { Hero } from '@/components/home/Hero/Hero';
import { ProductGrid } from '@/components/product/ProductGrid/ProductGrid';
import { shopifyFetch } from '@/lib/shopify/client';
import { getAllProductsQuery } from '@/lib/shopify/queries';
import { getTranslations } from 'next-intl/server';
import styles from './page.module.css';

export default async function HomePage() {
  const t = await getTranslations('nav');
  
  let products = [];
  try {
    const { body } = await shopifyFetch<any>({
      query: getAllProductsQuery,
      variables: {
        first: 4
      }
    });
    products = body?.data?.products?.edges || [];
  } catch (e) {
    console.error('Error fetching featured products:', e);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Roze Silvers',
    url: 'https://rozesilvers.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://rozesilvers.com/en/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <section className={styles.featured}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('newArrivals')}</h2>
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}
