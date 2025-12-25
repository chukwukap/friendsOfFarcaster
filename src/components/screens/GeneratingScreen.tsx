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
import styles from "./GeneratingScreen.module.css";

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
        <div className={styles.container}>
            {/* Background */}
            <div className={styles.networkBg} />

            {/* Content with stagger */}
            <motion.div
                className={styles.content}
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Logo with fade-in */}
                <motion.div
                    className={styles.header}
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

                {/* Mascot in Orb with pulse animation */}
                <motion.div
                    className={styles.orbContainer}
                    variants={staggerItemVariants}
                >
                    <motion.div
                        className={styles.orb}
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
                                className={styles.mascot}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Orbiting Snowflakes with rotation */}
                    <motion.div
                        className={styles.orbit}
                        variants={rotateVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <Image
                            src={ASSETS.snowflake}
                            alt=""
                            width={24}
                            height={24}
                            className={styles.orbitSnowflake}
                        />
                    </motion.div>
                </motion.div>

                {/* Status with animated text */}
                <motion.div
                    className={styles.status}
                    variants={staggerItemVariants}
                >
                    <motion.h2
                        className={styles.title}
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
                        className={styles.info}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        @{username} + {friendCount} friends
                    </motion.p>
                </motion.div>

                {/* Progress with animation */}
                <motion.div
                    className={styles.progressContainer}
                    variants={staggerItemVariants}
                >
                    <ProgressBar
                        progress={progress}
                        message={LOADING_MESSAGES[messageIndex]}
                    />
                </motion.div>

                {/* Tips with fade transition */}
                <motion.div
                    className={styles.tip}
                    variants={staggerItemVariants}
                >
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={messageIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            💡 Your FOF will include your mutual connections
                        </motion.p>
                    </AnimatePresence>
                </motion.div>

                {/* Rising Sparkles with Framer Motion */}
                <div className={styles.sparkles}>
                    {[10, 30, 50, 70, 90].map((left, i) => (
                        <motion.span
                            key={i}
                            className={styles.sparkle}
                            style={{ left: `${left}%` }}
                            initial={{ y: 0, opacity: 0 }}
                            animate={{
                                y: [-100, -200],
                                opacity: [0, 1, 0],
                                scale: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
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
