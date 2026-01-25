import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { X } from 'lucide-react';
import styles from './MiniGameRunner.module.css';

interface MiniGameRunnerProps {
    onBack: () => void;
    onComplete?: (score: number) => void;
    children: React.ReactNode;
    title: string;
}

export const MiniGameRunner = ({ onBack, children, title }: MiniGameRunnerProps) => {
    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className={styles.container}
        >
            <div className={styles.header}>
                <Button variant="icon" onClick={onBack}>
                    <X size={32} />
                </Button>
                <h2 className={styles.title}>{title}</h2>
                <div style={{ width: 48 }} /> {/* Spacer for balance */}
            </div>

            <div className={styles.gameArea}>
                {children}
            </div>
        </motion.div>
    );
};
