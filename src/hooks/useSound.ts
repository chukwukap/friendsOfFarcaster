"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { SOUNDS } from "@/lib/constants";

type SoundCategory = "ambient" | "ui" | "progress" | "celebration" | "error";

interface SoundManagerOptions {
  enabled?: boolean;
  masterVolume?: number;
}

// Volume levels per category (0-1)
const VOLUME_LEVELS: Record<SoundCategory, number> = {
  ambient: 0.15,
  ui: 0.35,
  progress: 0.3,
  celebration: 0.55,
  error: 0.4,
};

export function useSound(options: SoundManagerOptions = {}) {
  const { enabled = true, masterVolume = 1 } = options;
  const [isMuted, setIsMuted] = useState(!enabled);
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  // Preload commonly used sounds
  useEffect(() => {
    if (typeof window === "undefined") return;

    const preloadSounds = [
      SOUNDS.buttonTap,
      SOUNDS.cardAppear,
      SOUNDS.successReveal,
      SOUNDS.confettiBurst,
      SOUNDS.pointsEarned,
    ];

    preloadSounds.forEach((src) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audioRefs.current.set(src, audio);
    });

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      audioRefs.current.clear();
    };
  }, []);

  // Play a sound effect
  const play = useCallback(
    (sound: string, category: SoundCategory = "ui") => {
      if (isMuted || typeof window === "undefined") return;

      try {
        let audio = audioRefs.current.get(sound);
        if (!audio) {
          audio = new Audio(sound);
          audioRefs.current.set(sound, audio);
        }

        audio.volume = VOLUME_LEVELS[category] * masterVolume;
        audio.currentTime = 0;
        audio.play().catch(() => {
          // Audio play failed - likely user hasn't interacted yet
        });
      } catch {
        // Silently fail if audio doesn't exist
      }
    },
    [isMuted, masterVolume]
  );

  // Start ambient loop
  const startAmbient = useCallback(
    (sound: string) => {
      if (isMuted || typeof window === "undefined") return;

      if (ambientRef.current) {
        ambientRef.current.pause();
      }

      try {
        ambientRef.current = new Audio(sound);
        ambientRef.current.loop = true;
        ambientRef.current.volume = VOLUME_LEVELS.ambient * masterVolume;
        ambientRef.current.play().catch(() => {});
      } catch {
        // Silently fail
      }
    },
    [isMuted, masterVolume]
  );

  // Stop ambient
  const stopAmbient = useCallback(() => {
    if (ambientRef.current) {
      ambientRef.current.pause();
      ambientRef.current = null;
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    if (!isMuted) {
      stopAmbient();
    }
  }, [isMuted, stopAmbient]);

  // Convenience methods for common sounds
  const sounds = {
    // UI
    buttonTap: () => play(SOUNDS.buttonTap, "ui"),
    buttonHover: () => play(SOUNDS.buttonHover, "ui"),
    cardAppear: () => play(SOUNDS.cardAppear, "ui"),
    navigationSwipe: () => play(SOUNDS.navigationSwipe, "ui"),
    toggleOn: () => play(SOUNDS.toggleOn, "ui"),
    toggleOff: () => play(SOUNDS.toggleOff, "ui"),

    // Progress
    progressStart: () => play(SOUNDS.progressStart, "progress"),
    progressTick: () => play(SOUNDS.progressTick, "progress"),
    generationPulse: () => play(SOUNDS.generationPulse, "progress"),
    almostDone: () => play(SOUNDS.almostDone, "progress"),

    // Celebration
    successReveal: () => play(SOUNDS.successReveal, "celebration"),
    confettiBurst: () => play(SOUNDS.confettiBurst, "celebration"),
    pointsEarned: () => play(SOUNDS.pointsEarned, "celebration"),
    pointsBonus: () => play(SOUNDS.pointsBonus, "celebration"),
    shareComplete: () => play(SOUNDS.shareComplete, "celebration"),

    // Error
    gentleError: () => play(SOUNDS.gentleError, "error"),
    connectionLost: () => play(SOUNDS.connectionLost, "error"),

    // Ambient
    startWinterAmbient: () => startAmbient(SOUNDS.winterAmbient),
    startNetworkPulse: () => startAmbient(SOUNDS.networkPulse),
    startSuccessGlow: () => startAmbient(SOUNDS.successGlow),
    stopAmbient,
  };

  return {
    play,
    sounds,
    isMuted,
    toggleMute,
    startAmbient,
    stopAmbient,
  };
}
