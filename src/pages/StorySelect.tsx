import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { STORIES, type Story } from '../data/stories';
import { Button } from '../components/Button';
import { ArrowLeft, Play } from 'lucide-react';
import styles from './StorySelect.module.css';

export const StorySelect = () => {
    const { setScreen, setStory } = useGame();
    const [selectedStory, setSelectedStory] = useState<Story | null>(null);

    const handleStart = () => {
        if (selectedStory) {
            setStory(selectedStory.id);
            setScreen('STORY_BOARD');
        }
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className={styles.backButton}>
                <Button variant="secondary" onClick={() => setScreen('CHARACTER_SELECT')}>
                    <ArrowLeft /> Back
                </Button>
            </div>

            <h1 className={styles.title}>Pick Your Adventure!</h1>

            <div className={styles.storyGrid}>
                {STORIES.map((story) => (
                    <motion.div
                        key={story.id}
                        className={`${styles.storyCard} ${selectedStory?.id === story.id ? styles.selected : ''}`}
                        onClick={() => setSelectedStory(story)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className={styles.storyIcon}>
                            {story.theme === 'GROCERY' ? '🍕' : '🚀'}
                        </span>
                        <h2 className={styles.storyTitle}>{story.title}</h2>
                        <div className={styles.itemList}>
                            {story.items.map((item) => (
                                <span key={item.id} className={styles.itemIcon} title={item.name}>
                                    {item.icon}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {selectedStory && (
                <motion.div
                    className={styles.buttonRow}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Button variant="primary" size="lg" onClick={handleStart}>
                        <Play /> Start: {selectedStory.title}
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
};
