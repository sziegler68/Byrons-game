import { useGame } from '../context/GameContext';
import { STORIES } from '../data/stories';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import styles from './ShoppingListHUD.module.css';
import { getStoryIcon } from './StoryIcons';

export const ShoppingListHUD = () => {
    const { currentStoryId, inventory } = useGame();
    const story = STORIES.find(s => s.id === currentStoryId);

    if (!story) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>{story.title}</h3>
                <span className={styles.progress}>
                    {inventory.length} / {story.items.length}
                </span>
            </div>
            <div className={styles.grid}>
                {story.items.map((item) => {
                    const isCollected = inventory.includes(item.id);
                    return (
                        <div key={item.id} className={`${styles.item} ${isCollected ? styles.collected : ''}`}>
                            <div className={styles.iconWrapper}>
                                {getStoryIcon(item.icon, 32)}
                                <AnimatePresence>
                                    {isCollected && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className={styles.checkBadge}
                                        >
                                            <Check size={14} strokeWidth={4} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <span className={styles.itemName}>{item.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
