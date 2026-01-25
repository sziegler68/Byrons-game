import { GameProvider, useGame } from './context/GameContext';
import { Home } from './pages/Home';
import { CharacterSelect } from './pages/CharacterSelect';
import { StorySelect } from './pages/StorySelect';
import { StoryBoard } from './pages/StoryBoard';
import { SettingsScreen } from './pages/SettingsScreen';
import { TracingGame } from './components/minigames/TracingGame';
import { STORIES } from './data/stories';

const GameContent = () => {
  const { currentScreen, setScreen, currentStoryId, inventory, addItem, pendingReward, setPendingReward } = useGame() as any;

  const handleMiniGameComplete = () => {
    // Award the pending ingredient if one was set
    if (pendingReward) {
      addItem(pendingReward);
      setPendingReward(null);
    } else {
      // Fallback: Award next uncollected ingredient
      const story = STORIES.find(s => s.id === currentStoryId);
      if (story) {
        const nextIngredient = story.items.find(item => !inventory.includes(item.id));
        if (nextIngredient) {
          addItem(nextIngredient.id);
        }
      }
    }
    setScreen('STORY_BOARD');
  };

  return (
    <div className="app-container">
      {currentScreen === 'HOME' && <Home />}
      {currentScreen === 'CHARACTER_SELECT' && <CharacterSelect />}
      {currentScreen === 'STORY_SELECT' && <StorySelect />}
      {currentScreen === 'FREE_PLAY_MENU' && <div>Free Play Menu Placeholder</div>}
      {currentScreen === 'SETTINGS' && <SettingsScreen />}
      {currentScreen === 'STORY_BOARD' && <StoryBoard />}
      {currentScreen === 'MINI_GAME' && (
        <TracingGame
          onBack={() => setScreen('STORY_BOARD')}
          onComplete={handleMiniGameComplete}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
