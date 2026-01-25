/**
 * useStrokeActivation Hook
 * 
 * Manages the stroke activation logic for the tracing game.
 * Tracks touch position, calculates zone coverage, and handles stroke completion.
 */

import { useState, useCallback, useRef } from 'react';
import { type StrokeZone, type Point, isPointInPolygon } from './StrokeZoneData';

interface CoverageGrid {
    cells: boolean[][];
    validCells: number;
    activatedCells: number;
}

interface UseStrokeActivationReturn {
    currentStrokeIndex: number;
    completedStrokes: number[];
    isComplete: boolean;
    coverage: number;

    /** Call on touch/mouse move with normalized coordinates (0-100) */
    handleTouch: (point: Point) => void;

    /** Reset to initial state */
    reset: () => void;
}

const GRID_SIZE = 12; // 12x12 grid for coverage tracking
const TOUCH_RADIUS = 8; // How many grid units a touch affects

export function useStrokeActivation(strokes: StrokeZone[]): UseStrokeActivationReturn {
    const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
    const [completedStrokes, setCompletedStrokes] = useState<number[]>([]);

    // Coverage grid for current stroke
    const coverageRef = useRef<CoverageGrid | null>(null);
    const [coverage, setCoverage] = useState(0);

    // Initialize coverage grid for a stroke
    const initCoverageGrid = useCallback((stroke: StrokeZone): CoverageGrid => {
        const cells: boolean[][] = [];
        let validCells = 0;

        for (let row = 0; row < GRID_SIZE; row++) {
            cells[row] = [];
            for (let col = 0; col < GRID_SIZE; col++) {
                // Check if cell center is inside the zone
                const cellX = (col + 0.5) * (100 / GRID_SIZE);
                const cellY = (row + 0.5) * (100 / GRID_SIZE);
                const isValid = isPointInPolygon({ x: cellX, y: cellY }, stroke.zone);
                cells[row][col] = false; // Not activated yet
                if (isValid) validCells++;
            }
        }

        return { cells, validCells, activatedCells: 0 };
    }, []);

    // Ensure we have a grid for the current stroke
    const ensureGrid = useCallback(() => {
        if (!coverageRef.current && currentStrokeIndex < strokes.length) {
            coverageRef.current = initCoverageGrid(strokes[currentStrokeIndex]);
        }
        return coverageRef.current;
    }, [currentStrokeIndex, strokes, initCoverageGrid]);

    // Handle touch input
    const handleTouch = useCallback((point: Point) => {
        if (currentStrokeIndex >= strokes.length) return;

        const stroke = strokes[currentStrokeIndex];
        const grid = ensureGrid();
        if (!grid || grid.validCells === 0) return;

        // Check if point is in the zone
        if (!isPointInPolygon(point, stroke.zone)) {
            // Outside zone - no penalty, just ignore
            return;
        }

        // Activate cells near the touch point
        const cellX = Math.floor(point.x / (100 / GRID_SIZE));
        const cellY = Math.floor(point.y / (100 / GRID_SIZE));

        // Activate cells within touch radius
        for (let dy = -TOUCH_RADIUS; dy <= TOUCH_RADIUS; dy++) {
            for (let dx = -TOUCH_RADIUS; dx <= TOUCH_RADIUS; dx++) {
                const row = cellY + dy;
                const col = cellX + dx;

                if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
                    // Check if cell is valid (inside zone) and not already activated
                    const cellCenterX = (col + 0.5) * (100 / GRID_SIZE);
                    const cellCenterY = (row + 0.5) * (100 / GRID_SIZE);

                    if (!grid.cells[row][col] && isPointInPolygon({ x: cellCenterX, y: cellCenterY }, stroke.zone)) {
                        // Check distance from touch point to cell center
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist <= TOUCH_RADIUS) {
                            grid.cells[row][col] = true;
                            grid.activatedCells++;
                        }
                    }
                }
            }
        }

        // Calculate coverage
        const newCoverage = grid.validCells > 0 ? grid.activatedCells / grid.validCells : 0;
        setCoverage(newCoverage);

        // Check if stroke is complete
        if (newCoverage >= stroke.completionThreshold) {
            // Mark stroke as complete
            setCompletedStrokes(prev => [...prev, currentStrokeIndex]);

            // Move to next stroke
            const nextIndex = currentStrokeIndex + 1;
            setCurrentStrokeIndex(nextIndex);

            // Reset grid for next stroke
            coverageRef.current = null;
            setCoverage(0);
        }
    }, [currentStrokeIndex, strokes, ensureGrid]);

    // Reset everything
    const reset = useCallback(() => {
        setCurrentStrokeIndex(0);
        setCompletedStrokes([]);
        coverageRef.current = null;
        setCoverage(0);
    }, []);

    return {
        currentStrokeIndex,
        completedStrokes,
        isComplete: completedStrokes.length >= strokes.length,
        coverage,
        handleTouch,
        reset
    };
}
