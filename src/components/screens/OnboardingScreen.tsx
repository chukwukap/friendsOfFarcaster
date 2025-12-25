"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ASSETS } from "@/lib/constants";
import {
    staggerContainerVariants,
    staggerItemVariants,
    mascotVariants,
    springTransition,
} from "@/lib/animations";
import styles from "./OnboardingScreen.module.css";

interface OnboardingScreenProps {
    onComplete: () => void;
}

interface OnboardingPage {
    title: string;
    description: string;
    mascotImage: string;
    highlight?: string;
    mascotAnimation: "idle" | "thinking" | "celebrating";
}

const PAGES: OnboardingPage[] = [
    {
        title: "Welcome to FOF",
        description: "Friends of Farcaster brings your network to life with stunning AI-generated art",
        mascotImage: ASSETS.mascotWaving,
        highlight: "Christmas Edition 2024",
        mascotAnimation: "idle",
    },
    {
        title: "Your Network, As Art",
        description: "We transform your closest Farcaster connections into a unique portrait you'll love to share",
        mascotImage: ASSETS.mascotDefault,
        mascotAnimation: "thinking",
    },
    {
        title: "Earn & Share",
        description: "Get 100 Waffles points for each creation. Share your FOF and spread the holiday joy!",
        mascotImage: ASSETS.mascotCelebrating,
        highlight: "+100 pts",
        mascotAnimation: "celebrating",
    },
];

// Page transition variants
const pageContentVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

export const OnboardingScreen: FC<OnboardingScreenProps> = ({ onComplete }) => {
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < PAGES.length - 1) {
            setCurrentPage((prev) => prev + 1);
        } else {
            onComplete();
        }
    };

    const handleSkip = () => {
        onComplete();
    };

    const page = PAGES[currentPage];
    const isLastPage = currentPage === PAGES.length - 1;

    return (
        <div className={styles.container}>
            {/* Background */}
            <div className={styles.networkBg} />

            {/* Skip button with fade in */}
            <AnimatePresence>
                {!isLastPage && (
                    <motion.button
                        className={styles.skipButton}
                        onClick={handleSkip}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Skip
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Content */}
            <motion.div
                className={styles.content}
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Mascot with animation based on page */}
                <motion.div
                    className={styles.mascotContainer}
                    variants={staggerItemVariants}
                >
                    <motion.div
                        className={styles.mascotGlow}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            variants={mascotVariants}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={page.mascotAnimation}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={springTransition}
                        >
                            <Image
                                src={page.mascotImage}
                                alt="FOF Mascot"
                                width={200}
                                height={200}
                                className={styles.mascot}
                                priority
                            />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Text with page transitions */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        className={styles.textContainer}
                        variants={pageContentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {page.highlight && (
                            <motion.span
                                className={styles.highlight}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {page.highlight}
                            </motion.span>
                        )}
                        <motion.h1
                            className={styles.title}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.15 }}
                        >
                            {page.title}
                        </motion.h1>
                        <motion.p
                            className={styles.description}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {page.description}
                        </motion.p>
                    </motion.div>
                </AnimatePresence>

                {/* Dots with scale animation */}
                <motion.div className={styles.dots} variants={staggerItemVariants}>
                    {PAGES.map((_, index) => (
                        <motion.button
                            key={index}
                            className={`${styles.dot} ${index === currentPage ? styles.dotActive : ""}`}
                            onClick={() => setCurrentPage(index)}
                            aria-label={`Page ${index + 1}`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            animate={{
                                scale: index === currentPage ? 1.2 : 1,
                            }}
                            transition={springTransition}
                        />
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div className={styles.cta} variants={staggerItemVariants}>
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={handleNext}
                    >
                        {isLastPage ? "Let's Go! 🎄" : "Next"}
                    </Button>
                </motion.div>
            </motion.div>

            {/* Floating Elements with continuous animation */}
            <div className={styles.floatingElements}>
                <motion.div
                    className={styles.floatingSnowflake1}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Image src={ASSETS.snowflake} alt="" width={40} height={40} aria-hidden />
                </motion.div>
                <motion.div
                    className={styles.floatingSnowflake2}
                    animate={{
                        y: [0, 15, 0],
                        rotate: [0, -180, -360],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                >
                    <Image src={ASSETS.snowflake} alt="" width={28} height={28} aria-hidden />
                </motion.div>
                <AnimatePresence>
                    {currentPage === 2 && (
                        <motion.div
                            className={styles.floatingCoin}
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                rotate: 0,
                                y: [0, -10, 0],
                            }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{
                                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                default: springTransition,
                            }}
                        >
                            <Image src={ASSETS.wafflesCoin} alt="" width={48} height={48} aria-hidden />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
