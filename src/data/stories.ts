export type MiniGameType = 'TRACING' | 'MATCHING' | 'SORTING' | 'STEP';

export interface StoryItem {
    id: string;
    name: string;
    icon: string; // Key for StoryIcons mapper
    color: string; // Associated tile color
}

export interface StoryStep {
    id: string;
    instruction: string;
    type: MiniGameType;
    duration?: number;
}

export interface Story {
    id: string;
    title: string;
    theme: 'GROCERY' | 'HARDWARE';
    items: StoryItem[]; // Ingredients or Parts
    steps: StoryStep[]; // Cooking or Building steps
    finalImage: string; // Path to celebration image
}

export const STORIES: Story[] = [
    {
        id: 'pizza',
        title: 'Pizza Party',
        theme: 'GROCERY',
        items: [
            { id: 'dough', name: 'Dough', icon: 'dough', color: '#FF6B6B' }, // Red Tile
            { id: 'sauce', name: 'Tomato Sauce', icon: 'sauce', color: '#4ECDC4' }, // Teal Tile
            { id: 'cheese', name: 'Cheese', icon: 'cheese', color: '#FFE66D' }, // Yellow Tile
            { id: 'pep', name: 'Pepperoni', icon: 'pep', color: '#FF6B6B' },
            { id: 'veg', name: 'Veggies', icon: 'veg', color: '#4ECDC4' },
        ],
        steps: [
            { id: 'roll', instruction: 'Roll the dough!', type: 'TRACING' },
            { id: 'sauce', instruction: 'Spread the sauce!', type: 'STEP' },
            { id: 'cheese', instruction: 'Sprinkle cheese!', type: 'STEP' },
            { id: 'bake', instruction: 'Put it in the oven!', type: 'STEP' },
        ],
        finalImage: '/assets/pizza_party.png'
    },
    {
        id: 'rocket',
        title: 'Build a Rocket',
        theme: 'HARDWARE',
        items: [
            { id: 'body', name: 'Metal Body', icon: 'body', color: '#FF6B6B' },
            { id: 'nose', name: 'Nose Cone', icon: 'nose', color: '#4ECDC4' },
            { id: 'fins', name: 'Fins', icon: 'fins', color: '#FFE66D' },
            { id: 'engine', name: 'Engine', icon: 'engine', color: '#FF6B6B' },
            { id: 'window', name: 'Window', icon: 'window', color: '#4ECDC4' },
        ],
        steps: [
            { id: 'weld', instruction: 'Weld the body!', type: 'TRACING' },
            { id: 'attach_fins', instruction: 'Screw on the fins!', type: 'STEP' },
            { id: 'paint', instruction: 'Paint it red!', type: 'STEP' },
        ],
        finalImage: '/assets/rocket_launch.png'
    }
];
