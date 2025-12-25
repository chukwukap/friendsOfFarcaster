"use client";

import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnhancedProgressBarProps {
    progress: number;
}

const STAGES = [
    { threshold: 0, emoji: "🔍", label: "Finding your friends..." },
    { threshold: 20, emoji: "📸", label: "Gathering photos..." },
    { threshold: 40, emoji: "🎨", label: "Creating your portrait..." },
    { threshold: 60, emoji: "✨", label: "Adding holiday magic..." },
    { threshold: 80, emoji: "🎁", label: "Wrapping it up..." },
    { threshold: 95, emoji: "🎄", label: "Almost done!" },
];

function getCurrentStage(progress: number) {
    for (let i = STAGES.length - 1; i >= 0; i--) {
        if (progress >= STAGES[i].threshold) {
            return STAGES[i];
        }
    }
    return STAGES[0];
}

export const EnhancedProgressBar: FC<EnhancedProgressBarProps> = ({ progress }) => {
    const currentStage = getCurrentStage(progress);
    const [dots, setDots] = useState("");

    // Animated dots
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Stage indicator */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStage.label}
                    className="flex items-center justify-center gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.span
                        className="text-2xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        {currentStage.emoji}
                    </motion.span>
                    <span className="text-[15px] text-text-secondary">
                        {currentStage.label}
                    </span>
                </motion.div>
            </AnimatePresence>

            {/* Progress bar track */}
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden relative">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-purple/20 via-accent-gold/20 to-secondary-purple/20" />

                {/* Progress fill */}
                <motion.div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{
                        background: "linear-gradient(90deg, #9B59B6, #E6C200, #FF7043)",
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Shimmer sweep */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Glow on leading edge */}
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white/60 to-transparent" />
                </motion.div>
            </div>

            {/* Percentage */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <span className="text-xl font-bold text-white tabular-nums">
                    {Math.round(progress)}%
                </span>
                <span className="text-text-secondary ml-1">{dots}</span>
            </motion.div>

            {/* Encouraging message at key milestones */}
            <AnimatePresence>
                {progress > 50 && progress < 90 && (
                    <motion.p
                        className="text-xs text-center text-accent-gold/80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        AI is working its magic ✨
                    </motion.p>
                )}
                {progress >= 90 && (
                    <motion.p
                        className="text-xs text-center text-accent-gold"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        Your FOF is ready in seconds! 🎄
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};
