import { useCallback } from 'react';

export const useSpeech = () => {
    const speak = useCallback((text: string, rate = 1.1, pitch = 1.4) => {
        if (!('speechSynthesis' in window)) return;

        // Cancel any pending speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;

        // Try to select a better voice
        const voices = window.speechSynthesis.getVoices();
        // Look for "Natural" or specific female/child-like voices if available
        const preferredVoice = voices.find(v =>
            v.name.includes('Google US English') ||
            v.name.includes('Samantha') || // iOS friendly
            v.name.includes('Natural')
        ) || voices[0];

        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
    }, []);

    return { speak };
};
