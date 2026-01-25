import { useState, useEffect } from 'react';

interface DiceProps {
    rolling: boolean;
    value: number;
    onRollComplete?: () => void;
}

export const Dice = ({ rolling, value, onRollComplete }: DiceProps) => {
    const [displayValue, setDisplayValue] = useState(1);

    useEffect(() => {
        if (rolling) {
            const interval = setInterval(() => {
                setDisplayValue(Math.floor(Math.random() * 6) + 1);
            }, 100);
            return () => clearInterval(interval);
        } else {
            setDisplayValue(value);
            onRollComplete?.();
        }
    }, [rolling, value, onRollComplete]);

    const dots = (val: number) => {
        const positions = [
            [], // 0
            [[50, 50]], // 1
            [[20, 20], [80, 80]], // 2
            [[20, 20], [50, 50], [80, 80]], // 3
            [[20, 20], [20, 80], [80, 20], [80, 80]], // 4
            [[20, 20], [20, 80], [50, 50], [80, 20], [80, 80]], // 5
            [[20, 20], [20, 50], [20, 80], [80, 20], [80, 50], [80, 80]], // 6
        ];
        return positions[val] || [];
    };

    return (
        <div style={{
            width: 80,
            height: 80,
            backgroundColor: 'white',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            border: '2px solid #333',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {dots(displayValue).map(([top, left], i) => (
                <div key={i} style={{
                    position: 'absolute',
                    top: `${top}%`,
                    left: `${left}%`,
                    width: 12,
                    height: 12,
                    backgroundColor: '#333',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)'
                }} />
            ))}
        </div>
    );
};
