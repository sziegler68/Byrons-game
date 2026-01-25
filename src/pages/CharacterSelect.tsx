import { useGame } from '../context/GameContext';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import styles from './CharacterSelect.module.css';

export const CharacterSelect = () => {
    const { players, selectPlayer, setScreen, currentMode } = useGame();

    const handleSelect = (playerId: string) => {
        selectPlayer(playerId);
        // Proceed based on mode
        if (currentMode === 'STORY') {
            setScreen('STORY_SELECT');
        } else {
            setScreen('FREE_PLAY_MENU');
        }
    };

    return (
        <div className={styles.container}>
            <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={styles.title}
            >
                Who are you?
            </motion.h2>

            <div className={styles.grid}>
                {players.map((player) => (
                    <motion.div
                        key={player.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <button
                            className={styles.card}
                            style={{ '--player-color': player.color } as React.CSSProperties}
                            onClick={() => handleSelect(player.id)}
                        >
                            <div className={styles.avatar}>{player.avatar}</div>
                            <div className={styles.name}>{player.name}</div>
                        </button>
                    </motion.div>
                ))}
            </div>

            <Button variant="icon" onClick={() => setScreen('HOME')}>
                ⬅️
            </Button>
        </div>
    );
};
