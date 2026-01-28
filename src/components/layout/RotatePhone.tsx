import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const RotatePhone = () => {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            // Check if height is strictly greater than width (classic portrait)
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        // Initial check
        checkOrientation();

        // Listen for resize/orientation change
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    if (!isPortrait) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#1a1a2e', // Dark blue/black background
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '20px'
        }}>
            <motion.div
                animate={{ rotate: 90 }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    repeatDelay: 0.5,
                    ease: "easeInOut"
                }}
                style={{ marginBottom: '20px' }}
            >
                {/* Simple Phone SVG Icon */}
                <svg width="64" height="100" viewBox="0 0 64 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="60" height="96" rx="8" stroke="white" strokeWidth="4" />
                    <circle cx="32" cy="88" r="4" fill="white" />
                </svg>
            </motion.div>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', marginBottom: '10px' }}>
                Please Rotate Your Phone
            </h2>
            <p style={{ fontFamily: 'Outfit, sans-serif', opacity: 0.8 }}>
                This game is designed to be played in landscape mode.
            </p>
        </div>
    );
};
