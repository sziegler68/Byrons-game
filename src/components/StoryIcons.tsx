import React from 'react';

// Simple SVG Icons for Story Items
// These replace the generic emojis with custom-drawn style icons (programmatic SVGs)

export const StoryIcons: Record<string, React.FC<{ size?: number, color?: string }>> = {
    // PIZZA THEME
    dough: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="#F4D03F" stroke="#B7950B" strokeWidth="3" />
            <path d="M30 40 Q50 60 70 40" stroke="#B7950B" strokeWidth="2" fill="none" opacity="0.5" />
        </svg>
    ),
    sauce: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="35" fill="#C0392B" />
            <path d="M25 50 Q50 25 75 50 Q50 75 25 50" fill="#E74C3C" opacity="0.6" />
        </svg>
    ),
    cheese: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <path d="M50 15 L85 85 L15 85 Z" fill="#F7DC6F" stroke="#F1C40F" strokeWidth="3" />
            <circle cx="40" cy="50" r="5" fill="#F9E79F" />
            <circle cx="60" cy="70" r="4" fill="#F9E79F" />
            <circle cx="45" cy="75" r="3" fill="#F9E79F" />
        </svg>
    ),
    pep: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="#E74C3C" stroke="#922B21" strokeWidth="2" />
            <circle cx="35" cy="40" r="4" fill="#922B21" opacity="0.3" />
            <circle cx="65" cy="55" r="5" fill="#922B21" opacity="0.3" />
            <circle cx="45" cy="70" r="3" fill="#922B21" opacity="0.3" />
        </svg>
    ),
    veg: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <path d="M20 50 Q50 10 80 50 Q50 90 20 50" fill="#2ECC71" stroke="#27AE60" strokeWidth="3" />
            <path d="M50 20 L50 80" stroke="#27AE60" strokeWidth="2" />
        </svg>
    ),

    // ROCKET THEME
    body: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <rect x="30" y="20" width="40" height="60" rx="5" fill="#AED6F1" stroke="#5DADE2" strokeWidth="3" />
            <circle cx="50" cy="40" r="10" fill="#D6EAF8" />
        </svg>
    ),
    nose: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <path d="M50 10 L80 80 L20 80 Z" fill="#E74C3C" stroke="#C0392B" strokeWidth="3" />
        </svg>
    ),
    fins: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <path d="M20 20 L40 20 L80 80 L20 80 Z" fill="#E74C3C" stroke="#C0392B" strokeWidth="3" transform="scale(-1, 1) translate(-100, 0)" />
        </svg>
    ),
    engine: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <path d="M30 20 L70 20 L60 60 L40 60 Z" fill="#5D6D7E" stroke="#34495E" strokeWidth="3" />
            <path d="M35 60 Q50 90 65 60" fill="#E67E22" />
        </svg>
    ),
    window: ({ size = 24 }) => (
        <svg width={size} height={size} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" fill="#AED6F1" stroke="#5DADE2" strokeWidth="4" />
            <circle cx="50" cy="50" r="20" fill="#3498DB" opacity="0.3" />
            <path d="M35 50 L65 50 M50 35 L50 65" stroke="white" strokeWidth="2" opacity="0.5" />
        </svg>
    )
};

export const getStoryIcon = (id: string, size = 32) => {
    const Icon = StoryIcons[id];
    return Icon ? <Icon size={size} /> : <span>❓</span>;
};
