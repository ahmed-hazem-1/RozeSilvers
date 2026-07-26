import { ProductCard } from '../ProductCard/ProductCard';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: any[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={styles.grid}>
      {products.map((productEdge, index) => (
        <ProductCard key={productEdge.node.id} product={productEdge.node} priority={index < 4} />
      ))}
    </div>
  );
}
