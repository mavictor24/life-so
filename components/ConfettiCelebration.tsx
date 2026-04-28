'use client';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface Props {
  trigger: boolean;
}

export default function ConfettiCelebration({ trigger }: Props) {
  useEffect(() => {
    if (!trigger) return;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#7C4DFF', '#FFD93D', '#6BCB77', '#FF6B6B', '#4ECDC4'],
      startVelocity: 35,
      gravity: 0.8,
      ticks: 200,
    });
  }, [trigger]);

  return null;
}
