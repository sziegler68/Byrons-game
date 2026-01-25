import { useGame, type GameType } from '../context/GameContext';
import { Button } from '../components/Button';
import { ShoppingListHUD } from '../components/ShoppingListHUD';
import { Dice } from '../components/Dice';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import styles from './StoryBoard.module.css';
import { useState, useEffect, useCallback } from 'react';
import { STORIES } from '../data/stories';

const BOARD_SIZE = 12; // Shorter board for quicker games
const TILE_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D']; // Red, Teal, Yellow

// Generate tile colors based on position
const getTileColor = (index: number): string | null => {
    if (index === 0 || index === BOARD_SIZE) return null; // Start/Finish are neutral
    return TILE_COLORS[(index - 1) % TILE_COLORS.length];
};

// Map Tile Color to Game Type
const getGameTypeForTile = (color: string): GameType => {
    switch (color) {
        case '#FF6B6B': return 'TRACING'; // Red -> ABCs
        case '#4ECDC4': return 'MATCHING'; // Teal -> Matching
        case '#FFE66D': return 'SORTING'; // Yellow -> Sorting
        default: return 'TRACING';
    }
};

export const StoryBoard = () => {
    const {
        setScreen,
        currentPlayerId,
        players,
        currentMode,
        currentStoryId,
        inventory,
        setPendingReward,
        updatePlayerPosition,
        setActiveGameType
    } = useGame() as any;

    const [isRolling, setIsRolling] = useState(false);
    const [diceValue, setDiceValue] = useState(1);
    const [showGamePrompt, setShowGamePrompt] = useState(false);
    const [promptGameType, setPromptGameType] = useState<GameType | null>(null);
    const [targetPosition, setTargetPosition] = useState<number | null>(null);

    const currentPlayer = players.find((p: any) => p.id === currentPlayerId) || players[0];
    const story = STORIES.find(s => s.id === currentStoryId);

    // Get the NEXT uncollected ingredient regardless of tile color (Linear Progression)
    const getNextReferenceIngredient = useCallback(() => {
        if (!story) return null;
        return story.items.find((item: any) => !inventory.includes(item.id));
    }, [story, inventory]);

    // Check Logic (Memoized to be used in effect)
    const checkTile = useCallback((pos: number) => {
        if (pos >= BOARD_SIZE) {
            if (story && inventory.length >= story.items.length) {
                alert('All ingredients collected! Time to cook!');
            }
            return;
        }

        const tileColor = getTileColor(pos);
        if (tileColor && currentMode === 'STORY') {
            const nextItem = getNextReferenceIngredient();
            if (nextItem) {
                // Determine game type based on tile
                const gameType = getGameTypeForTile(tileColor);
                setPromptGameType(gameType);
                setPendingReward(nextItem.id); // Queue the reward
                setShowGamePrompt(true);
            }
        }
    }, [story, inventory, currentMode, getNextReferenceIngredient, setPendingReward]);

    // Movement Loop
    useEffect(() => {
        if (targetPosition !== null && currentPlayer.position < targetPosition) {
            const timer = setTimeout(() => {
                updatePlayerPosition(currentPlayer.id, currentPlayer.position + 1);
            }, 400);
            return () => clearTimeout(timer);
        } else if (targetPosition !== null && currentPlayer.position === targetPosition) {
            // Landed!
            setTargetPosition(null); // Clear target
            checkTile(currentPlayer.position);
        }
    }, [targetPosition, currentPlayer.position, updatePlayerPosition, currentPlayer.id, checkTile]);

    const handlePlayGame = () => {
        if (promptGameType) {
            setActiveGameType(promptGameType);
            setScreen('MINI_GAME');
            setShowGamePrompt(false);
        }
    };

    const nextIngredient = getNextReferenceIngredient();

    return (
        <div className={styles.container}>
            {currentMode === 'STORY' && <ShoppingListHUD />}

            <div className={styles.header}>
                <Button variant="icon" onClick={() => setScreen('HOME')}>
                    <Home />
                </Button>
                <div className={styles.playerInfo}>
                    <span className={styles.avatar}>{currentPlayer.avatar}</span>
                    <span className={styles.playerName}>{currentPlayer.name}'s Turn</span>
                </div>
            </div>

            <div className={styles.boardArea}>
                <div className={styles.path}>
                    {Array.from({ length: BOARD_SIZE + 1 }).map((_, index) => {
                        const tileColor = getTileColor(index);
                        return (
                            <div
                                key={index}
                                className={`${styles.tile} ${index === currentPlayer.position ? styles.activeTile : ''}`}
                                style={tileColor ? { backgroundColor: tileColor } : undefined}
                            >
                                {index === 0 ? '🏠' : index === BOARD_SIZE ? '🏁' : ''}
                                {index === currentPlayer.position && (
                                    <motion.div
                                        layoutId="player-meeple"
                                        className={styles.meeple}
                                        transition={{ type: "spring", bounce: 0.5 }}
                                    >
                                        {currentPlayer.avatar}
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.controls}>
                {showGamePrompt ? (
                    <div className={styles.promptContainer}>
                        <div className={styles.speechBubble}>
                            Let's play a <strong>{promptGameType}</strong> game to get the <strong>{nextIngredient?.name}</strong>!
                        </div>
                        <Button variant="primary" size="xl" onClick={handlePlayGame}>
                            🎮 Play Game!
                        </Button>
                    </div>
                ) : (
                    <div className={styles.diceSection}>
                        <Dice
                            rolling={isRolling}
                            value={diceValue}
                        />
                        <Button
                            variant="accent"
                            size="xl"
                            onClick={() => {
                                if (isRolling || targetPosition !== null) return;
                                setIsRolling(true);
                                const roll = Math.floor(Math.random() * 6) + 1;
                                setTimeout(() => {
                                    setIsRolling(false);
                                    setDiceValue(roll);
                                    // Start step-by-step move
                                    setTargetPosition(Math.min(currentPlayer.position + roll, BOARD_SIZE));
                                }, 1500); // 1.5s dice roll visual
                            }}
                            disabled={isRolling || targetPosition !== null}
                        >
                            {isRolling ? 'Rolling...' : 'ROLL!'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
