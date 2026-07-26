'use client';

import { useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { FiX, FiMinus, FiPlus, FiTrash2, FiTag } from 'react-icons/fi';
import { Button } from '@/components/ui/Button/Button';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import styles from './CartDrawer.module.css';
import { useState } from 'react';

export function CartDrawer() {
  const t = useTranslations('cart');
  const { isOpen, closeCart, cart, isLoading, updateItemQuantity, removeItem, applyDiscountCode } = useCart();
  const [discountCode, setDiscountCode] = useState('');

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCode.trim()) return;
    await applyDiscountCode(discountCode);
    setDiscountCode('');
  };

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} 
        onClick={handleBackdropClick}
      />
      
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('title')}</h2>
          <button className={styles.closeButton} onClick={closeCart}>
            <FiX size={24} />
          </button>
        </div>

        <div className={styles.body}>
          {isLoading && (!cart || !cart.lines) ? (
            <div className={styles.empty}>Loading...</div>
          ) : !cart || !cart.lines || cart.lines?.edges.length === 0 ? (
            <div className={styles.empty}>
              <p>{t('empty')}</p>
              <Button variant="primary" onClick={closeCart}>{t('continueShopping')}</Button>
            </div>
          ) : (
            <div className={styles.itemsList}>
              {cart.lines.edges.map(({ node }: any) => {
                const product = node.merchandise.product;
                const image = node.merchandise.image;
                const price = node.merchandise.price;
                return (
                  <div key={node.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      {image && (
                        <Image src={image.url} alt={image.altText || product.title} width={80} height={100} style={{ objectFit: 'cover' }} />
                      )}
                    </div>
                    <div className={styles.itemDetails}>
                      <Link href={`/products/${product.handle}`} onClick={closeCart} className={styles.itemTitle}>
                        {product.title}
                      </Link>
                      <p className={styles.itemPrice}>
                        {parseFloat(price.amount).toLocaleString(undefined, { style: 'currency', currency: price.currencyCode })}
                      </p>
                      
                      <div className={styles.itemActions}>
                        <div className={styles.quantitySelector}>
                          <button onClick={() => updateItemQuantity(node.id, node.quantity - 1)} disabled={isLoading}>
                            <FiMinus size={14} />
                          </button>
                          <span>{node.quantity}</span>
                          <button onClick={() => updateItemQuantity(node.id, node.quantity + 1)} disabled={isLoading}>
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <button className={styles.removeBtn} onClick={() => removeItem(node.id)} disabled={isLoading}>
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart && cart.lines?.edges.length > 0 && (
          <div className={styles.footer}>
            
            {cart.discountCodes?.map((dc: any) => (
              <div key={dc.code} className={styles.appliedDiscount}>
                <FiTag size={14} />
                <span>{dc.code}</span>
                {dc.applicable ? (
                  <span className={styles.discountSuccess}>Applied</span>
                ) : (
                  <span className={styles.discountError}>Not applicable</span>
                )}
              </div>
            ))}

            <form onSubmit={handleApplyDiscount} className={styles.promoForm}>
              <input 
                type="text" 
                placeholder="Promo code" 
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className={styles.promoInput}
                disabled={isLoading}
              />
              <button type="submit" className={styles.promoBtn} disabled={isLoading || !discountCode.trim()}>
                Apply
              </button>
            </form>

            <div className={styles.subtotal}>
              <span>Subtotal:</span>
              <span>{parseFloat(cart.cost.subtotalAmount.amount).toLocaleString(undefined, { style: 'currency', currency: cart.cost.subtotalAmount.currencyCode })}</span>
            </div>
            <a href={cart.checkoutUrl} className={styles.checkoutLink}>
              <Button variant="primary" fullWidth>{t('checkout')}</Button>
            </a>
          </div>
        )}
      </div>
    </>
  );
}
