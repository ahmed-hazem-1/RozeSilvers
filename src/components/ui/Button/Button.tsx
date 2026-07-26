import React, { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import { Link } from '@/i18n/routing';
import styles from './Button.module.css';

type BaseProps = {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

type ButtonAsButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: never;
};

type ButtonAsLinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', fullWidth, loading, className, children, href, disabled, ...props }, ref) => {
    
    const rootClassName = [
      styles.button,
      styles[variant],
      styles[`size-${size}`],
      fullWidth ? styles.fullWidth : '',
      disabled || loading ? styles.disabled : '',
      className
    ].filter(Boolean).join(' ');

    const innerContent = (
      <>
        {loading && <span className={styles.spinner} />}
        {children}
      </>
    );

    if (href) {
      return (
        <Link 
          href={href} 
          className={rootClassName} 
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
          ref={ref as React.Ref<HTMLAnchorElement>}
        >
          {innerContent}
        </Link>
      );
    }

    return (
      <button 
        className={rootClassName} 
        disabled={disabled || loading} 
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={ref as React.Ref<HTMLButtonElement>}
      >
        {innerContent}
      </button>
    );
  }
);

Button.displayName = 'Button';
