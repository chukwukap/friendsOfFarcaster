"use client";

import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ASSETS } from "@/lib/constants";
import {
    staggerContainerVariants,
    staggerItemVariants,
    rotateVariants,
    pulseVariants,
    springTransition,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

interface GeneratingScreenProps {
    username: string;
    friendCount: number;
    progress: number;
}

const LOADING_MESSAGES = [
    "Finding your closest friends...",
    "Analyzing your network connections...",
    "Gathering profile pictures...",
    "Adding festive Christmas magic...",
    "Weaving your network into art...",
    "Almost there, creating something special...",
];

export const GeneratingScreen: FC<GeneratingScreenProps> = ({
    username,
    friendCount,
    progress,
}) => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen h-[100dvh] flex flex-col relative overflow-hidden bg-bg-dark-start">
            {/* Background */}
            <div className="absolute inset-0 bg-[url('/assets/bg-network-pattern.png')] bg-cover bg-center opacity-40 pointer-events-none" />

            {/* Content with stagger */}
            <motion.div
                className="relative z-10 flex-1 flex flex-col items-center justify-center p-5 gap-6"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Logo with fade-in */}
                <motion.div
                    className="absolute top-[calc(env(safe-area-inset-top,0px)+16px)] left-0 right-0 flex justify-center"
                    variants={staggerItemVariants}
                >
                    <Image
                        src={ASSETS.logo}
                        alt="FOF"
                        width={80}
                        height={32}
                        priority
                    />
                </motion.div>

                {/* Mascot in Orb */}
                <motion.div
                    className="relative w-[200px] h-[200px] flex items-center justify-center"
                    variants={staggerItemVariants}
                >
                    <motion.div
                        className="w-[160px] h-[160px] rounded-full bg-surface-glass backdrop-blur-[20px] border border-surface-glass-border flex items-center justify-center shadow-[0_0_60px_var(--glow-purple)] animate-[pulse-glow_2s_ease-in-out_infinite]"
                        variants={pulseVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.div
                            animate={{
                                rotate: [-2, 2, -2],
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Image
                                src={ASSETS.mascotThinking}
                                alt="Creating..."
                                width={120}
                                height={120}
                                className="animate-[bob_2s_ease-in-out_infinite]"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Orbiting Snowflakes */}
                    <motion.div
                        className="absolute w-full h-full animate-[spin_10s_linear_infinite]"
                        variants={rotateVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <Image
                            src={ASSETS.snowflake}
                            alt=""
                            width={24}
                            height={24}
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                    </motion.div>
                </motion.div>

                {/* Status */}
                <motion.div
                    className="text-center"
                    variants={staggerItemVariants}
                >
                    <motion.h2
                        className="text-[24px] font-bold mb-xs text-white"
                        animate={{
                            opacity: [0.8, 1, 0.8],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        ✨ Creating your FOF
                    </motion.h2>
                    <motion.p
                        className="text-[15px] text-text-secondary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        @{username} + {friendCount} friends
                    </motion.p>
                </motion.div>

                {/* Progress */}
                <motion.div
                    className="w-full max-w-[300px]"
                    variants={staggerItemVariants}
                >
                    <ProgressBar
                        progress={progress}
                        message={LOADING_MESSAGES[messageIndex]}
                    />
                </motion.div>

                {/* Tip */}
                <motion.div
                    className="text-center p-md bg-surface-glass border-radius-md max-w-[300px]"
                    variants={staggerItemVariants}
                >
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={messageIndex}
                            className="text-[13px] text-text-secondary m-0"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            💡 Your FOF will include your mutual connections
                        </motion.p>
                    </AnimatePresence>
                </motion.div>

                {/* Rising Sparkles */}
                <div className="absolute bottom-0 left-0 right-0 h-[60%] pointer-events-none overflow-hidden">
                    {[10, 30, 50, 70, 90].map((left, i) => (
                        <motion.span
                            key={i}
                            className="absolute bottom-[-10px] w-1 h-1 bg-accent-gold rounded-full"
                            style={{ left: `${left}%` }}
                            initial={{ y: 0, opacity: 0 }}
                            animate={{
                                y: [-100, -200],
                                opacity: [0, 1, 0],
                                scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2 + Math.random(),
                                repeat: Infinity,
                                delay: i * 0.4,
                                ease: "easeOut",
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
