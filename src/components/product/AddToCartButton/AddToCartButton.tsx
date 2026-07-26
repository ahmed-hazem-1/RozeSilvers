'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button/Button';
import { useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import styles from './AddToCartButton.module.css';

interface AddToCartButtonProps {
  variantId: string;
  label: string;
}

export function AddToCartButton({ variantId, label }: AddToCartButtonProps) {
  const { addCartItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!variantId) return;
    setIsAdding(true);
    await addCartItem(variantId, quantity);
    setIsAdding(false);
    setQuantity(1); // reset after adding
  };

  return (
    <div className={styles.container}>
      <div className={styles.quantitySelector}>
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className={styles.qtyBtn}
          disabled={quantity <= 1 || isAdding}
        >
          <FiMinus size={16} />
        </button>
        <span className={styles.qtyNumber}>{quantity}</span>
        <button 
          onClick={() => setQuantity(quantity + 1)}
          className={styles.qtyBtn}
          disabled={isAdding}
        >
          <FiPlus size={16} />
        </button>
      </div>

      <div className={styles.buttonWrapper}>
        <Button 
          variant="primary" 
          size="large" 
          fullWidth 
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : label}
        </Button>
      </div>
    </div>
  );
}
