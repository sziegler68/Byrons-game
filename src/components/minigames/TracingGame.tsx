/**
 * TracingGame - Stroke Activation Model
 * 
 * A preschool-friendly tracing game where touch input activates and reveals
 * predefined strokes. The child does NOT draw - they trace over wide zones
 * to reveal the letter.
 * 
 * NO handwriting recognition. NO failure states. Extremely forgiving.
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { MiniGameRunner } from '../MiniGameRunner';
import { Button } from '../Button';
import { useSpeech } from '../../hooks/useSpeech';
import { TRACING_LETTERS, type TracingLetter, type Point } from './tracing/StrokeZoneData';
import { useStrokeActivation } from './tracing/useStrokeActivation';
import styles from './TracingGame.module.css';

// Pick a random letter for the game
const getRandomLetter = (): TracingLetter => {
    return TRACING_LETTERS[Math.floor(Math.random() * TRACING_LETTERS.length)];
};

interface TracingGameProps {
    onBack: () => void;
    onComplete?: () => void;
}

export const TracingGame = ({ onBack, onComplete }: TracingGameProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [letter] = useState<TracingLetter>(() => getRandomLetter());
    const [dimensions, setDimensions] = useState({ width: 300, height: 300 });
    const { speak } = useSpeech();

    const {
        currentStrokeIndex,
        completedStrokes,
        isComplete,
        handleTouch,
        // reset - available if needed
    } = useStrokeActivation(letter.strokes);

    // Scale factor for converting normalized coords (0-100) to pixels
    const scale = Math.min(dimensions.width, dimensions.height) / 100;
    const offsetX = (dimensions.width - 100 * scale) / 2;
    const offsetY = (dimensions.height - 100 * scale) / 2;

    // Convert pixel coords to normalized coords
    const toNormalized = useCallback((px: number, py: number): Point => {
        return {
            x: (px - offsetX) / scale,
            y: (py - offsetY) / scale
        };
    }, [offsetX, offsetY, scale]);

    // toPixels helper removed - not currently used

    // Resize handling
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    // Play initial sound
    useEffect(() => {
        speak(`Trace the letter ${letter.char}!`, 0.9, 1.0);
    }, [letter.char, speak]);

    // Play completion sound
    useEffect(() => {
        if (isComplete) {
            speak(`${letter.char} is for ${letter.word}! Great job!`, 0.9, 1.0);
        }
    }, [isComplete, letter, speak]);

    // Handle touch/mouse events
    const getEventPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
        const container = containerRef.current;
        if (!container) return null;

        const rect = container.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;

        if (clientX === undefined || clientY === undefined) return null;

        const px = clientX - rect.left;
        const py = clientY - rect.top;

        return toNormalized(px, py);
    }, [toNormalized]);

    const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (isComplete) return;

        const point = getEventPoint(e);
        if (point) {
            handleTouch(point);
        }
    }, [getEventPoint, handleTouch, isComplete]);

    // scalePath helper removed - not currently used

    const currentStroke = letter.strokes[currentStrokeIndex];

    return (
        <MiniGameRunner title={`Trace: ${letter.char}`} onBack={onBack}>
            {/* Sound replay button */}
            <div className={styles.headerControls}>
                <Button
                    variant="icon"
                    onClick={() => speak(`${letter.char}. ${letter.sound}. ${letter.word}.`, 0.9, 1.0)}
                    aria-label="Replay Sound"
                >
                    <Volume2 size={24} />
                </Button>
            </div>

            <div
                ref={containerRef}
                className={styles.canvasContainer}
                onMouseMove={handlePointerMove}
                onTouchMove={handlePointerMove}
                onTouchStart={handlePointerMove}
            >
                <svg
                    width={dimensions.width}
                    height={dimensions.height}
                    className={styles.tracingSvg}
                >
                    {/* Transform group for scaling */}
                    <g transform={`translate(${offsetX}, ${offsetY}) scale(${scale})`}>

                        {/* LAYER 1: Faded letter background (all strokes, gray) */}
                        {letter.strokes.map((stroke, idx) => (
                            <path
                                key={`bg-${idx}`}
                                d={stroke.visualPath}
                                fill="none"
                                stroke="#e0e0e0"
                                strokeWidth={12}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        ))}

                        {/* LAYER 2: Completed strokes (colored, revealed) */}
                        {completedStrokes.map((strokeIdx) => {
                            const stroke = letter.strokes[strokeIdx];
                            return (
                                <motion.path
                                    key={`done-${strokeIdx}`}
                                    d={stroke.visualPath}
                                    fill="none"
                                    stroke="#FF6B6B"
                                    strokeWidth={10}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                />
                            );
                        })}

                        {/* LAYER 3: Current stroke zone highlight (subtle) */}
                        {currentStroke && !isComplete && (
                            <motion.polygon
                                points={currentStroke.zone.map(p => `${p.x},${p.y}`).join(' ')}
                                fill="rgba(78, 205, 196, 0.15)"
                                stroke="rgba(78, 205, 196, 0.3)"
                                strokeWidth={1}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            />
                        )}

                        {/* LAYER 4: Start indicator (GO circle) */}
                        {currentStroke && !isComplete && (
                            <motion.g
                                initial={{ scale: 0 }}
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <circle
                                    cx={currentStroke.startIndicator.x}
                                    cy={currentStroke.startIndicator.y}
                                    r={8}
                                    fill="#4ECDC4"
                                    stroke="white"
                                    strokeWidth={2}
                                />
                                <text
                                    x={currentStroke.startIndicator.x}
                                    y={currentStroke.startIndicator.y + 1}
                                    fill="white"
                                    fontSize={5}
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    GO
                                </text>
                            </motion.g>
                        )}
                    </g>
                </svg>

                {/* LAYER 5: Completion overlay */}
                <AnimatePresence>
                    {isComplete && (
                        <motion.div
                            className={styles.successOverlay}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className={styles.successEmoji}>{letter.emoji}</div>
                            <div className={styles.successWord}>{letter.word}!</div>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => onComplete?.()}
                            >
                                Next →
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </MiniGameRunner>
    );
};
