import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// The "Target" resolution we code against.
// 960x540 is qHD (exactly 1/2 of 1080p, 1/4 of 4k).
// It's a safe 16:9 aspect ratio that runs great on mobile performance-wise.
const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

interface GameScalerProps {
    children: ReactNode;
}

export const GameScaler = ({ children }: GameScalerProps) => {
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // Calculate the scale needed to fit the width
            const scaleX = windowWidth / GAME_WIDTH;
            // Calculate the scale needed to fit the height
            const scaleY = windowHeight / GAME_HEIGHT;

            // Choose the smaller scale to ensure the game fits entirely within the screen (letterboxing)
            const newScale = Math.min(scaleX, scaleY);

            setScale(newScale);
        };

        window.addEventListener('resize', handleResize);
        // Call once on mount
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#111', // Letterbox color (dark gray/black)
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'fixed', // Prevent body scrolling
            top: 0,
            left: 0
        }}>
            <div style={{
                width: GAME_WIDTH,
                height: GAME_HEIGHT,
                transform: `scale(${scale})`,
                // Start transformation from center so it scales evenly
                transformOrigin: 'center center',
                backgroundColor: '#fff', // Or your game's base background
                position: 'relative',
                boxShadow: '0 0 50px rgba(0,0,0,0.5)', // Nice shadow to separate from letterbox
                overflow: 'hidden'
            }}>
                {children}
            </div>
        </div>
    );
};
