/**
 * Stroke-Activation Tracing Game Data Model
 * 
 * Each letter is defined as a sequence of wide polygon zones.
 * Touch input activates zones, not draws lines.
 * All coordinates are normalized 0-100 for easy scaling.
 */

export interface Point {
    x: number;
    y: number;
}

export interface StrokeZone {
    id: string;

    /** Polygon vertices defining the wide interaction zone (clockwise, normalized 0-100) */
    zone: Point[];

    /** SVG path string for the pretty visual stroke to reveal */
    visualPath: string;

    /** Where the "GO" indicator should appear */
    startIndicator: Point;

    /** Completion threshold (0-1). 0.25 = 25% coverage needed */
    completionThreshold: number;
}

export interface TracingLetter {
    char: string;
    strokes: StrokeZone[];
    sound: string;
    word: string;
    emoji: string;
}

// Helper to create a wide stroke zone from a centerline
// Takes start/end points and a width, generates a rectangular polygon
function makeZone(start: Point, end: Point, width: number): Point[] {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    // Perpendicular unit vector
    const px = (-dy / len) * (width / 2);
    const py = (dx / len) * (width / 2);

    return [
        { x: start.x + px, y: start.y + py },
        { x: end.x + px, y: end.y + py },
        { x: end.x - px, y: end.y - py },
        { x: start.x - px, y: start.y - py },
    ];
}

// Helper for curved/arc zones - creates a thick arc segment
function makeArcZone(
    cx: number, cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    width: number
): Point[] {
    const innerR = radius - width / 2;
    const outerR = radius + width / 2;
    const steps = 8;
    const points: Point[] = [];

    // Outer arc (forward)
    for (let i = 0; i <= steps; i++) {
        const t = startAngle + (endAngle - startAngle) * (i / steps);
        points.push({ x: cx + outerR * Math.cos(t), y: cy + outerR * Math.sin(t) });
    }
    // Inner arc (backward)
    for (let i = steps; i >= 0; i--) {
        const t = startAngle + (endAngle - startAngle) * (i / steps);
        points.push({ x: cx + innerR * Math.cos(t), y: cy + innerR * Math.sin(t) });
    }

    return points;
}

// Standard stroke width for all letters (very forgiving)
const W = 25;

/**
 * LETTER DEFINITIONS
 * Each letter uses wide polygon zones for touch detection.
 * Visual paths are SVG path strings for the "pretty" reveal.
 */
export const TRACING_LETTERS: TracingLetter[] = [
    {
        char: 'A',
        sound: 'ahh',
        word: 'Apple',
        emoji: '🍎',
        strokes: [
            {
                id: 'left-leg',
                zone: makeZone({ x: 50, y: 10 }, { x: 15, y: 90 }, W),
                visualPath: 'M 50 10 L 15 90',
                startIndicator: { x: 50, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'right-leg',
                zone: makeZone({ x: 50, y: 10 }, { x: 85, y: 90 }, W),
                visualPath: 'M 50 10 L 85 90',
                startIndicator: { x: 50, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'crossbar',
                zone: makeZone({ x: 25, y: 55 }, { x: 75, y: 55 }, W),
                visualPath: 'M 25 55 L 75 55',
                startIndicator: { x: 25, y: 55 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'B',
        sound: 'buh',
        word: 'Bear',
        emoji: '🐻',
        strokes: [
            {
                id: 'stem',
                zone: makeZone({ x: 25, y: 10 }, { x: 25, y: 90 }, W),
                visualPath: 'M 25 10 L 25 90',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'top-bump',
                zone: makeArcZone(25, 32, 22, -Math.PI / 2, Math.PI / 2, W),
                visualPath: 'M 25 10 A 22 22 0 0 1 25 54',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'bottom-bump',
                zone: makeArcZone(25, 68, 22, -Math.PI / 2, Math.PI / 2, W),
                visualPath: 'M 25 46 A 22 22 0 0 1 25 90',
                startIndicator: { x: 25, y: 46 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'C',
        sound: 'kuh',
        word: 'Cat',
        emoji: '🐱',
        strokes: [
            {
                id: 'curve',
                zone: makeArcZone(50, 50, 35, -Math.PI * 0.7, Math.PI * 0.7, W),
                visualPath: 'M 85 25 A 35 35 0 1 0 85 75',
                startIndicator: { x: 80, y: 25 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'D',
        sound: 'duh',
        word: 'Dog',
        emoji: '🐕',
        strokes: [
            {
                id: 'stem',
                zone: makeZone({ x: 25, y: 10 }, { x: 25, y: 90 }, W),
                visualPath: 'M 25 10 L 25 90',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'curve',
                zone: makeArcZone(25, 50, 40, -Math.PI / 2, Math.PI / 2, W),
                visualPath: 'M 25 10 A 40 40 0 0 1 25 90',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'E',
        sound: 'eh',
        word: 'Elephant',
        emoji: '🐘',
        strokes: [
            {
                id: 'stem',
                zone: makeZone({ x: 25, y: 10 }, { x: 25, y: 90 }, W),
                visualPath: 'M 25 10 L 25 90',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'top',
                zone: makeZone({ x: 25, y: 10 }, { x: 75, y: 10 }, W),
                visualPath: 'M 25 10 L 75 10',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'middle',
                zone: makeZone({ x: 25, y: 50 }, { x: 65, y: 50 }, W),
                visualPath: 'M 25 50 L 65 50',
                startIndicator: { x: 25, y: 50 },
                completionThreshold: 0.75
            },
            {
                id: 'bottom',
                zone: makeZone({ x: 25, y: 90 }, { x: 75, y: 90 }, W),
                visualPath: 'M 25 90 L 75 90',
                startIndicator: { x: 25, y: 90 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'F',
        sound: 'fff',
        word: 'Fish',
        emoji: '🐟',
        strokes: [
            {
                id: 'stem',
                zone: makeZone({ x: 25, y: 10 }, { x: 25, y: 90 }, W),
                visualPath: 'M 25 10 L 25 90',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'top',
                zone: makeZone({ x: 25, y: 10 }, { x: 75, y: 10 }, W),
                visualPath: 'M 25 10 L 75 10',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'middle',
                zone: makeZone({ x: 25, y: 50 }, { x: 60, y: 50 }, W),
                visualPath: 'M 25 50 L 60 50',
                startIndicator: { x: 25, y: 50 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'G',
        sound: 'guh',
        word: 'Giraffe',
        emoji: '🦒',
        strokes: [
            {
                id: 'curve',
                zone: makeArcZone(50, 50, 35, -Math.PI * 0.7, Math.PI * 0.7, W),
                visualPath: 'M 85 25 A 35 35 0 1 0 85 75',
                startIndicator: { x: 80, y: 25 },
                completionThreshold: 0.75
            },
            {
                id: 'bar',
                zone: makeZone({ x: 50, y: 50 }, { x: 85, y: 50 }, W),
                visualPath: 'M 50 50 L 85 50',
                startIndicator: { x: 85, y: 50 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'H',
        sound: 'huh',
        word: 'Hat',
        emoji: '🧢',
        strokes: [
            {
                id: 'left',
                zone: makeZone({ x: 20, y: 10 }, { x: 20, y: 90 }, W),
                visualPath: 'M 20 10 L 20 90',
                startIndicator: { x: 20, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'right',
                zone: makeZone({ x: 80, y: 10 }, { x: 80, y: 90 }, W),
                visualPath: 'M 80 10 L 80 90',
                startIndicator: { x: 80, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'cross',
                zone: makeZone({ x: 20, y: 50 }, { x: 80, y: 50 }, W),
                visualPath: 'M 20 50 L 80 50',
                startIndicator: { x: 20, y: 50 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'I',
        sound: 'ih',
        word: 'Igloo',
        emoji: '🏠',
        strokes: [
            {
                id: 'top',
                zone: makeZone({ x: 30, y: 10 }, { x: 70, y: 10 }, W),
                visualPath: 'M 30 10 L 70 10',
                startIndicator: { x: 30, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'stem',
                zone: makeZone({ x: 50, y: 10 }, { x: 50, y: 90 }, W),
                visualPath: 'M 50 10 L 50 90',
                startIndicator: { x: 50, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'bottom',
                zone: makeZone({ x: 30, y: 90 }, { x: 70, y: 90 }, W),
                visualPath: 'M 30 90 L 70 90',
                startIndicator: { x: 30, y: 90 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'J',
        sound: 'juh',
        word: 'Jellyfish',
        emoji: '🪼',
        strokes: [
            {
                id: 'top',
                zone: makeZone({ x: 30, y: 10 }, { x: 70, y: 10 }, W),
                visualPath: 'M 30 10 L 70 10',
                startIndicator: { x: 30, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'stem',
                zone: makeZone({ x: 50, y: 10 }, { x: 50, y: 70 }, W),
                visualPath: 'M 50 10 L 50 70',
                startIndicator: { x: 50, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'hook',
                zone: makeArcZone(35, 70, 15, 0, Math.PI, W),
                visualPath: 'M 50 70 A 15 15 0 0 1 20 70',
                startIndicator: { x: 50, y: 70 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'K',
        sound: 'kuh',
        word: 'Kite',
        emoji: '🪁',
        strokes: [
            {
                id: 'stem',
                zone: makeZone({ x: 25, y: 10 }, { x: 25, y: 90 }, W),
                visualPath: 'M 25 10 L 25 90',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'upper',
                zone: makeZone({ x: 75, y: 10 }, { x: 25, y: 50 }, W),
                visualPath: 'M 75 10 L 25 50',
                startIndicator: { x: 75, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'lower',
                zone: makeZone({ x: 35, y: 40 }, { x: 75, y: 90 }, W),
                visualPath: 'M 35 40 L 75 90',
                startIndicator: { x: 35, y: 40 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'L',
        sound: 'lll',
        word: 'Lion',
        emoji: '🦁',
        strokes: [
            {
                id: 'stem',
                zone: makeZone({ x: 25, y: 10 }, { x: 25, y: 90 }, W),
                visualPath: 'M 25 10 L 25 90',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'base',
                zone: makeZone({ x: 25, y: 90 }, { x: 75, y: 90 }, W),
                visualPath: 'M 25 90 L 75 90',
                startIndicator: { x: 25, y: 90 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'M',
        sound: 'mmm',
        word: 'Monkey',
        emoji: '🐵',
        strokes: [
            {
                id: 'left',
                zone: makeZone({ x: 15, y: 90 }, { x: 15, y: 10 }, W),
                visualPath: 'M 15 90 L 15 10',
                startIndicator: { x: 15, y: 90 },
                completionThreshold: 0.75
            },
            {
                id: 'left-peak',
                zone: makeZone({ x: 15, y: 10 }, { x: 50, y: 50 }, W),
                visualPath: 'M 15 10 L 50 50',
                startIndicator: { x: 15, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'right-peak',
                zone: makeZone({ x: 50, y: 50 }, { x: 85, y: 10 }, W),
                visualPath: 'M 50 50 L 85 10',
                startIndicator: { x: 50, y: 50 },
                completionThreshold: 0.75
            },
            {
                id: 'right',
                zone: makeZone({ x: 85, y: 10 }, { x: 85, y: 90 }, W),
                visualPath: 'M 85 10 L 85 90',
                startIndicator: { x: 85, y: 10 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'N',
        sound: 'nnn',
        word: 'Nest',
        emoji: '🪺',
        strokes: [
            {
                id: 'left',
                zone: makeZone({ x: 20, y: 90 }, { x: 20, y: 10 }, W),
                visualPath: 'M 20 90 L 20 10',
                startIndicator: { x: 20, y: 90 },
                completionThreshold: 0.75
            },
            {
                id: 'diagonal',
                zone: makeZone({ x: 20, y: 10 }, { x: 80, y: 90 }, W),
                visualPath: 'M 20 10 L 80 90',
                startIndicator: { x: 20, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'right',
                zone: makeZone({ x: 80, y: 90 }, { x: 80, y: 10 }, W),
                visualPath: 'M 80 90 L 80 10',
                startIndicator: { x: 80, y: 90 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'O',
        sound: 'oh',
        word: 'Octopus',
        emoji: '🐙',
        strokes: [
            {
                id: 'circle',
                zone: makeArcZone(50, 50, 35, 0, Math.PI * 2, W),
                visualPath: 'M 85 50 A 35 35 0 1 1 85 49.99',
                startIndicator: { x: 85, y: 50 },
                completionThreshold: 0.7
            }
        ]
    },
    {
        char: 'P',
        sound: 'puh',
        word: 'Penguin',
        emoji: '🐧',
        strokes: [
            {
                id: 'stem',
                zone: makeZone({ x: 25, y: 10 }, { x: 25, y: 90 }, W),
                visualPath: 'M 25 10 L 25 90',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'bump',
                zone: makeArcZone(25, 32, 22, -Math.PI / 2, Math.PI / 2, W),
                visualPath: 'M 25 10 A 22 22 0 0 1 25 54',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'Q',
        sound: 'kwuh',
        word: 'Queen',
        emoji: '👑',
        strokes: [
            {
                id: 'circle',
                zone: makeArcZone(50, 45, 32, 0, Math.PI * 2, W),
                visualPath: 'M 82 45 A 32 32 0 1 1 82 44.99',
                startIndicator: { x: 82, y: 45 },
                completionThreshold: 0.7
            },
            {
                id: 'tail',
                zone: makeZone({ x: 60, y: 65 }, { x: 85, y: 95 }, W),
                visualPath: 'M 60 65 L 85 95',
                startIndicator: { x: 60, y: 65 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'R',
        sound: 'rrr',
        word: 'Rabbit',
        emoji: '🐰',
        strokes: [
            {
                id: 'stem',
                zone: makeZone({ x: 25, y: 10 }, { x: 25, y: 90 }, W),
                visualPath: 'M 25 10 L 25 90',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'bump',
                zone: makeArcZone(25, 32, 22, -Math.PI / 2, Math.PI / 2, W),
                visualPath: 'M 25 10 A 22 22 0 0 1 25 54',
                startIndicator: { x: 25, y: 10 },
                completionThreshold: 0.75
            },
            {
                id: 'leg',
                zone: makeZone({ x: 40, y: 50 }, { x: 75, y: 90 }, W),
                visualPath: 'M 40 50 L 75 90',
                startIndicator: { x: 40, y: 50 },
                completionThreshold: 0.75
            }
        ]
    },
    {
        char: 'S',
        sound: 'sss',
        word: 'Snake',
        emoji: '🐍',
        strokes: [
            {
                id: 'curve',
                zone: [
                    { x: 75, y: 5 }, { x: 85, y: 15 }, { x: 75, y: 30 },
                    { x: 50, y: 40 }, { x: 25, y: 50 },
                    { x: 15, y: 65 }, { x: 25, y: 85 }, { x: 50, y: 95 },
                    { x: 75, y: 85 }, { x: 85, y: 75 },
                    // Inner curve going back
                    { x: 70, y: 75 }, { x: 55, y: 80 }, { x: 40, y: 75 },
                    { x: 35, y: 65 }, { x: 50, y: 55 },
                    { x: 65, y: 45 }, { x: 60, y: 25 },
                    { x: 50, y: 15 }, { x: 60, y: 5 }
                ],
                visualPath: 'M 75 15 C 50 5 25 20 25 35 C 25 50 50 50 50 50 C 50 50 75 50 75 65 C 75 80 50 95 25 85',
                startIndicator: { x: 75, y: 15 },
                completionThreshold: 0.7
            }
        ]
    },
    {
        char: 'T',
        sound: 'tuh',
        word: 'Turtle',
        emoji: '🐢',
        strokes: [
            {
                id: 'top',
                zone: makeZone({ x: 15, y: 10 }, { x: 85, y: 10 }, W),
                visualPath: 'M 15 10 L 85 10',
                startIndicator: { x: 15, y: 10 },
                completionThreshold: 0.25
            },
            {
                id: 'stem',
                zone: makeZone({ x: 50, y: 10 }, { x: 50, y: 90 }, W),
                visualPath: 'M 50 10 L 50 90',
                startIndicator: { x: 50, y: 10 },
                completionThreshold: 0.25
            }
        ]
    },
    {
        char: 'U',
        sound: 'uh',
        word: 'Umbrella',
        emoji: '☂️',
        strokes: [
            {
                id: 'curve',
                zone: [
                    { x: 10, y: 10 }, { x: 30, y: 10 },  // Top left
                    { x: 30, y: 60 },  // Down left
                    { x: 40, y: 80 }, { x: 50, y: 90 }, { x: 60, y: 80 },  // Bottom curve
                    { x: 70, y: 60 },  // Up right
                    { x: 70, y: 10 }, { x: 90, y: 10 },  // Top right
                    { x: 90, y: 70 },  // Down right (outer)
                    { x: 75, y: 95 }, { x: 50, y: 100 }, { x: 25, y: 95 },  // Bottom outer
                    { x: 10, y: 70 }  // Up left (outer)
                ],
                visualPath: 'M 20 10 L 20 70 Q 20 90 50 90 Q 80 90 80 70 L 80 10',
                startIndicator: { x: 20, y: 10 },
                completionThreshold: 0.2
            }
        ]
    },
    {
        char: 'V',
        sound: 'vvv',
        word: 'Violin',
        emoji: '🎻',
        strokes: [
            {
                id: 'left',
                zone: makeZone({ x: 15, y: 10 }, { x: 50, y: 90 }, W),
                visualPath: 'M 15 10 L 50 90',
                startIndicator: { x: 15, y: 10 },
                completionThreshold: 0.25
            },
            {
                id: 'right',
                zone: makeZone({ x: 50, y: 90 }, { x: 85, y: 10 }, W),
                visualPath: 'M 50 90 L 85 10',
                startIndicator: { x: 50, y: 90 },
                completionThreshold: 0.25
            }
        ]
    },
    {
        char: 'W',
        sound: 'wuh',
        word: 'Whale',
        emoji: '🐋',
        strokes: [
            {
                id: 's1',
                zone: makeZone({ x: 10, y: 10 }, { x: 30, y: 90 }, W),
                visualPath: 'M 10 10 L 30 90',
                startIndicator: { x: 10, y: 10 },
                completionThreshold: 0.25
            },
            {
                id: 's2',
                zone: makeZone({ x: 30, y: 90 }, { x: 50, y: 40 }, W),
                visualPath: 'M 30 90 L 50 40',
                startIndicator: { x: 30, y: 90 },
                completionThreshold: 0.25
            },
            {
                id: 's3',
                zone: makeZone({ x: 50, y: 40 }, { x: 70, y: 90 }, W),
                visualPath: 'M 50 40 L 70 90',
                startIndicator: { x: 50, y: 40 },
                completionThreshold: 0.25
            },
            {
                id: 's4',
                zone: makeZone({ x: 70, y: 90 }, { x: 90, y: 10 }, W),
                visualPath: 'M 70 90 L 90 10',
                startIndicator: { x: 70, y: 90 },
                completionThreshold: 0.25
            }
        ]
    },
    {
        char: 'X',
        sound: 'ks',
        word: 'Xylophone',
        emoji: '🎹',
        strokes: [
            {
                id: 'down-right',
                zone: makeZone({ x: 15, y: 10 }, { x: 85, y: 90 }, W),
                visualPath: 'M 15 10 L 85 90',
                startIndicator: { x: 15, y: 10 },
                completionThreshold: 0.25
            },
            {
                id: 'down-left',
                zone: makeZone({ x: 85, y: 10 }, { x: 15, y: 90 }, W),
                visualPath: 'M 85 10 L 15 90',
                startIndicator: { x: 85, y: 10 },
                completionThreshold: 0.25
            }
        ]
    },
    {
        char: 'Y',
        sound: 'yuh',
        word: 'Yak',
        emoji: '🦬',
        strokes: [
            {
                id: 'left-arm',
                zone: makeZone({ x: 15, y: 10 }, { x: 50, y: 50 }, W),
                visualPath: 'M 15 10 L 50 50',
                startIndicator: { x: 15, y: 10 },
                completionThreshold: 0.25
            },
            {
                id: 'right-arm',
                zone: makeZone({ x: 85, y: 10 }, { x: 50, y: 50 }, W),
                visualPath: 'M 85 10 L 50 50',
                startIndicator: { x: 85, y: 10 },
                completionThreshold: 0.25
            },
            {
                id: 'stem',
                zone: makeZone({ x: 50, y: 50 }, { x: 50, y: 90 }, W),
                visualPath: 'M 50 50 L 50 90',
                startIndicator: { x: 50, y: 50 },
                completionThreshold: 0.25
            }
        ]
    },
    {
        char: 'Z',
        sound: 'zzz',
        word: 'Zebra',
        emoji: '🦓',
        strokes: [
            {
                id: 'top',
                zone: makeZone({ x: 15, y: 10 }, { x: 85, y: 10 }, W),
                visualPath: 'M 15 10 L 85 10',
                startIndicator: { x: 15, y: 10 },
                completionThreshold: 0.25
            },
            {
                id: 'diagonal',
                zone: makeZone({ x: 85, y: 10 }, { x: 15, y: 90 }, W),
                visualPath: 'M 85 10 L 15 90',
                startIndicator: { x: 85, y: 10 },
                completionThreshold: 0.25
            },
            {
                id: 'bottom',
                zone: makeZone({ x: 15, y: 90 }, { x: 85, y: 90 }, W),
                visualPath: 'M 15 90 L 85 90',
                startIndicator: { x: 15, y: 90 },
                completionThreshold: 0.25
            }
        ]
    }
];

// Utility: Check if a point is inside a polygon (ray casting algorithm)
export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
    let inside = false;
    const n = polygon.length;

    for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y)) &&
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }

    return inside;
}
