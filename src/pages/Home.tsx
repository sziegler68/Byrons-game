import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { Play, Grid } from 'lucide-react';
import styles from './Home.module.css';

export const Home = () => {
    const { setScreen, setMode } = useGame();

    const handleStartStory = () => {
        setMode('STORY');
        setScreen('CHARACTER_SELECT');
    };

    const handleFreePlay = () => {
        setMode('FREE_PLAY');
        setScreen('FREE_PLAY_MENU'); // Will build this later
    };

    return (
        <div className={styles.container}>
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={styles.title}
            >
                Byron's Game
            </motion.h1>

            <div className={styles.menu}>
                <Button variant="primary" size="xl" onClick={handleStartStory}>
                    <Play size={32} />
                    Play Story
                </Button>

                <Button variant="secondary" size="lg" onClick={handleFreePlay}>
                    <Grid size={24} />
                    Free Play
                </Button>

                <Button variant="primary" onClick={() => setScreen('SETTINGS')}>
                    Settings
                </Button>
            </div>
        </div>
    );
};
