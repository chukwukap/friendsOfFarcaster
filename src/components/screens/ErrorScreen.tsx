"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ASSETS } from "@/lib/constants";
import {
    staggerContainerVariants,
    staggerItemVariants,
    mascotVariants,
    springTransition,
} from "@/lib/animations";
import styles from "./ErrorScreen.module.css";

interface ErrorScreenProps {
    title?: string;
    message?: string;
    onRetry: () => void;
    onGoHome?: () => void;
}

export const ErrorScreen: FC<ErrorScreenProps> = ({
    title = "Oops! Something went wrong",
    message = "Don't worry, we're on it. Please try again.",
    onRetry,
    onGoHome,
}) => {
    return (
        <div className={styles.container}>
            {/* Background */}
            <div className={styles.networkBg} />

            {/* Content with stagger animation */}
            <motion.div
                className={styles.content}
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Sad Mascot with shake animation */}
                <motion.div
                    className={styles.mascotContainer}
                    variants={staggerItemVariants}
                >
                    <motion.div
                        variants={mascotVariants}
                        animate="sad"
                    >
                        <Image
                            src={ASSETS.mascotSad}
                            alt="Something went wrong"
                            width={160}
                            height={160}
                            className={styles.mascot}
                            priority
                        />
                    </motion.div>
                    <motion.div
                        className={styles.brokenLine}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    />
                </motion.div>

                {/* Text with fade-in */}
                <motion.div
                    className={styles.textContainer}
                    variants={staggerItemVariants}
                >
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        className={styles.message}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {message}
                    </motion.p>
                </motion.div>

                {/* CTAs with stagger */}
                <motion.div
                    className={styles.ctas}
                    variants={staggerContainerVariants}
                >
                    <motion.div variants={staggerItemVariants}>
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={onRetry}
                        >
                            Try Again
                        </Button>
                    </motion.div>
                    {onGoHome && (
                        <motion.div variants={staggerItemVariants}>
                            <Button
                                variant="secondary"
                                onClick={onGoHome}
                            >
                                Go Home
                            </Button>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};
