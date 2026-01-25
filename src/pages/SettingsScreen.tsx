import { motion } from 'framer-motion';
import { useGame, type Difficulty, AVAILABLE_GAME_TYPES } from '../context/GameContext';
import { Button } from '../components/Button';
import { Volume2, VolumeX, ArrowLeft, CheckCircle, Ban } from 'lucide-react';
import styles from './SettingsScreen.module.css';

export const SettingsScreen = () => {
    const { setScreen, difficulty, setDifficulty, volume, toggleVolume, enabledGameTypes, toggleGameType } = useGame();

    const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
        >
            <div style={{ alignSelf: 'flex-start' }}>
                <Button variant="secondary" onClick={() => setScreen('HOME')}>
                    <ArrowLeft className="icon-left" /> Back
                </Button>
            </div>

            <h1 className={styles.title}>Settings</h1>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Difficulty</h2>
                <div className={styles.difficultyGrid}>
                    {difficulties.map((level) => (
                        <Button
                            key={level}
                            variant={difficulty === level ? 'primary' : 'outline'}
                            onClick={() => setDifficulty(level)}
                        >
                            {level}
                        </Button>
                    ))}
                </div>
                <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#666' }}>
                    {difficulty === 'EASY' && 'Simple tracing (1 letter), face-up matching.'}
                    {difficulty === 'MEDIUM' && 'Words (3 letters), hidden matching.'}
                    {difficulty === 'HARD' && 'Full sentences, complex matching.'}
                </p>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Enabled Games</h2>
                <div className={styles.difficultyGrid}>
                    {AVAILABLE_GAME_TYPES.map((type) => {
                        const isEnabled = enabledGameTypes.includes(type);
                        return (
                            <Button
                                key={type}
                                variant={isEnabled ? 'primary' : 'outline'}
                                onClick={() => toggleGameType(type)}
                            >
                                {isEnabled ? <CheckCircle size={18} /> : <Ban size={18} />}
                                <span style={{ fontSize: '0.8em' }}>{type}</span>
                            </Button>
                        );
                    })}
                </div>
            </div>

            <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Sound</h2>
                <div className={styles.volumeControl}>
                    <span>Game Volume</span>
                    <Button variant="icon" onClick={toggleVolume}>
                        {volume > 0 ? <Volume2 size={32} /> : <VolumeX size={32} />}
                    </Button>
                </div>
            </div>

        </motion.div>
    );
};
