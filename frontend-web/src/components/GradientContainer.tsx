import { ReactNode } from 'react';
import styles from '../styles/GradientContainer.module.scss';

interface GradientContainerProps {
  children: ReactNode;
  className?: string;  // Allow additional styling
}

export const GradientContainer = ({ children, className }: GradientContainerProps) => {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      {children}
    </div>
  );
};