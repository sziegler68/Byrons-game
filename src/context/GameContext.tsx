import { createContext, useContext, useState, type ReactNode } from 'react';

export type Screen = 'HOME' | 'CHARACTER_SELECT' | 'STORY_SELECT' | 'STORY_BOARD' | 'FREE_PLAY_MENU' | 'MINI_GAME' | 'SETTINGS';
export type GameMode = 'STORY' | 'FREE_PLAY';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

// Define available game types for toggling (excluding internal types like STEP)
export const AVAILABLE_GAME_TYPES = ['TRACING', 'MATCHING', 'SORTING'] as const;
export type GameType = typeof AVAILABLE_GAME_TYPES[number];

export interface Player {
    id: string;
    name: string;
    color: string;
    avatar: string; // Emoji or path to SVG
    position: number; // Board position
}

interface GameState {
    currentScreen: Screen;
    currentMode: GameMode | null;
    difficulty: Difficulty;
    players: Player[];
    currentPlayerId: string | null;
    volume: number; // 0-1
    inventory: string[]; // Collected item IDs
    enabledGameTypes: GameType[];
    currentStoryId: string | null;
}

interface GameContextType extends GameState {
    setScreen: (screen: Screen) => void;
    setMode: (mode: GameMode) => void;
    setDifficulty: (diff: Difficulty) => void;
    addPlayer: (player: Player) => void;
    selectPlayer: (playerId: string) => void;
    toggleVolume: () => void;
    addItem: (itemId: string) => void;
    clearInventory: () => void;
    toggleGameType: (type: GameType) => void;
    setStory: (storyId: string) => void;
    pendingReward: string | null;
    setPendingReward: (itemId: string | null) => void;
    updatePlayerPosition: (playerId: string, position: number) => void;
    activeGameType: GameType | null;
    setActiveGameType: (type: GameType | null) => void;
}

const defaultState: GameState = {
    currentScreen: 'HOME',
    currentMode: null,
    difficulty: 'EASY',
    players: [
        { id: 'p1', name: 'Dad', color: '#FF6B6B', avatar: '👨', position: 0 },
        { id: 'p2', name: 'Mom', color: '#4ECDC4', avatar: '👩', position: 0 },
        { id: 'p3', name: 'Brother', color: '#FFE66D', avatar: '👦', position: 0 },
        { id: 'p4', name: 'Sister', color: '#FF9F1C', avatar: '👧', position: 0 },
    ],
    currentPlayerId: null,
    volume: 1,
    inventory: [],
    enabledGameTypes: ['TRACING', 'MATCHING', 'SORTING'],
    currentStoryId: null
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<GameState>(defaultState);
    const [pendingReward, setPendingReward] = useState<string | null>(null);
    const [activeGameType, setActiveGameType] = useState<GameType | null>(null);

    const setScreen = (screen: Screen) => setState(prev => ({ ...prev, currentScreen: screen }));
    const setMode = (mode: GameMode) => setState(prev => ({ ...prev, currentMode: mode }));
    const setDifficulty = (diff: Difficulty) => setState(prev => ({ ...prev, difficulty: diff }));

    const addPlayer = (player: Player) =>
        setState(prev => ({ ...prev, players: [...prev.players, player] }));

    const selectPlayer = (playerId: string) =>
        setState(prev => ({ ...prev, currentPlayerId: playerId }));

    const updatePlayerPosition = (playerId: string, position: number) => {
        setState(prev => ({
            ...prev,
            players: prev.players.map(p => p.id === playerId ? { ...p, position } : p)
        }));
    };

    const toggleVolume = () =>
        setState(prev => ({ ...prev, volume: prev.volume > 0 ? 0 : 1 }));

    const addItem = (itemId: string) =>
        setState(prev => ({ ...prev, inventory: [...prev.inventory, itemId] }));

    const clearInventory = () =>
        setState(prev => ({ ...prev, inventory: [] }));

    const setStory = (storyId: string) =>
        setState(prev => ({ ...prev, currentStoryId: storyId, inventory: [] }));

    const toggleGameType = (type: GameType) => {
        setState(prev => {
            const isEnabled = prev.enabledGameTypes.includes(type);
            return {
                ...prev,
                enabledGameTypes: isEnabled
                    ? prev.enabledGameTypes.filter(t => t !== type)
                    : [...prev.enabledGameTypes, type]
            };
        });
    };

    return (
        <GameContext.Provider value={{
            ...state,
            pendingReward,
            setPendingReward,
            activeGameType,
            setActiveGameType,
            updatePlayerPosition,
            setScreen,
            setMode,
            setDifficulty,
            addPlayer,
            selectPlayer,
            toggleVolume,
            addItem,
            clearInventory,
            toggleGameType,
            setStory
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error('useGame must be used within a GameProvider');
    return context;
};
