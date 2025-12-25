"use client";

import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pointsPopVariants, sparkleVariants, springTransition } from "@/lib/animations";
import styles from "./PointsBadge.module.css";

interface PointsBadgeProps {
    points: number;
    size?: "sm" | "md" | "lg";
    animate?: boolean;
}

export const PointsBadge: FC<PointsBadgeProps> = ({
    points,
    size = "md",
    animate = true,
}) => {
    const [displayPoints, setDisplayPoints] = useState(0);
    const [showSparkle, setShowSparkle] = useState(false);

    // Animated count-up effect
    useEffect(() => {
        if (!animate) {
            setDisplayPoints(points);
            return;
        }

        const duration = 1000; // 1 second
        const steps = 30;
        const increment = points / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), points);
            setDisplayPoints(current);

            if (step >= steps) {
                clearInterval(timer);
                setShowSparkle(true);
                setTimeout(() => setShowSparkle(false), 1000);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [points, animate]);

    return (
        <motion.div
            className={`${styles.badge} ${styles[size]}`}
            variants={pointsPopVariants}
            initial="initial"
            animate="animate"
            whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
            }}
            transition={springTransition}
        >
            {/* Sparkle effects */}
            <AnimatePresence>
                {showSparkle && (
                    <>
                        <motion.span
                            className={styles.sparkle}
                            style={{ top: "-10px", left: "20%" }}
                            variants={sparkleVariants}
                            initial="initial"
                            animate="animate"
                            exit={{ opacity: 0, scale: 0 }}
                        >
                            ✨
                        </motion.span>
                        <motion.span
                            className={styles.sparkle}
                            style={{ top: "-5px", right: "15%" }}
                            variants={sparkleVariants}
                            initial="initial"
                            animate="animate"
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            ⭐
                        </motion.span>
                        <motion.span
                            className={styles.sparkle}
                            style={{ bottom: "-8px", left: "50%" }}
                            variants={sparkleVariants}
                            initial="initial"
                            animate="animate"
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            ✨
                        </motion.span>
                    </>
                )}
            </AnimatePresence>

            {/* Coin icon */}
            <motion.span
                className={styles.icon}
                animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 0.5,
                    delay: 0.8,
                }}
            >
                🧇
            </motion.span>

            {/* Points count */}
            <motion.span
                className={styles.count}
                key={displayPoints}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.1 }}
            >
                +{displayPoints}
            </motion.span>

            {/* Label */}
            <span className={styles.label}>pts</span>
        </motion.div>
    );
};
