"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { progressBarVariants, shimmerVariants, fadeInVariants } from "@/lib/animations";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
    progress: number;
    message?: string;
}

export const ProgressBar: FC<ProgressBarProps> = ({ progress, message }) => {
    return (
        <motion.div
            className={styles.container}
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
        >
            <div className={styles.track}>
                <motion.div
                    className={styles.fill}
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                >
                    {/* Shimmer effect */}
                    <motion.div
                        className={styles.shimmer}
                        variants={shimmerVariants}
                        initial="initial"
                        animate="animate"
                    />
                </motion.div>
            </div>
            {message && (
                <motion.p
                    className={styles.message}
                    key={message}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {message}
                </motion.p>
            )}
        </motion.div>
    );
};
