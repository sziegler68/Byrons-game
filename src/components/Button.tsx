import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'icon' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    disabled?: boolean;
}

export const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className,
    disabled
}: ButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(
                styles.btn,
                styles[variant],
                styles[size],
                className
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
};
