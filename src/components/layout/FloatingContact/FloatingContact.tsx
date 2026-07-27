'use client';

import { useState, useRef } from 'react';
import { FiMessageCircle, FiInstagram, FiFacebook } from 'react-icons/fi';
import styles from './FloatingContact.module.css';

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 450);
  };

  const handleToggleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div 
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`${styles.socialLinks} ${isOpen ? styles.open : ''}`}>
        <a 
          href="https://www.instagram.com/rosesilvers_/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.iconButton}
          title="Instagram"
        >
          <FiInstagram size={24} />
        </a>
        <a 
          href="https://www.facebook.com/profile.php?id=61592509382190" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.iconButton}
          title="Facebook"
        >
          <FiFacebook size={24} />
        </a>
      </div>
      
      <button 
        className={styles.mainButton} 
        aria-label="Contact Us"
        onClick={handleToggleClick}
      >
        <FiMessageCircle size={28} />
      </button>
    </div>
  );
}
