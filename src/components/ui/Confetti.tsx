"use client";

import { FC, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { confettiPieceVariants } from "@/lib/animations";
import styles from "./Confetti.module.css";

interface ConfettiProps {
    active: boolean;
    count?: number;
}

const COLORS = [
    "#E94560", // Red
    "#533483", // Purple
    "#FFD700", // Gold
    "#4ECDC4", // Teal
    "#FF6B6B", // Coral
    "#45B7D1", // Sky Blue
    "#96CEB4", // Sage
    "#FFEAA7", // Light Gold
];

export const Confetti: FC<ConfettiProps> = ({ active, count = 50 }) => {
    const pieces = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            color: COLORS[i % COLORS.length],
            size: 6 + Math.random() * 8,
            shape: Math.random() > 0.5 ? "square" : "circle",
            rotationSpeed: 360 + Math.random() * 720,
        }));
    }, [count]);

    return (
        <AnimatePresence>
            {active && (
                <div className={styles.container}>
                    {pieces.map((piece) => (
                        <motion.span
                            key={piece.id}
                            className={styles.piece}
                            style={{
                                left: piece.left,
                                backgroundColor: piece.color,
                                width: piece.size,
                                height: piece.size,
                                borderRadius: piece.shape === "circle" ? "50%" : "2px",
                            }}
                            initial={{
                                y: -20,
                                opacity: 0,
                                rotate: 0,
                                scale: 0,
                            }}
                            animate={{
                                y: "100vh",
                                opacity: [0, 1, 1, 1, 0],
                                rotate: piece.rotationSpeed,
                                scale: [0, 1, 1, 0.8, 0],
                                x: [0, Math.random() * 100 - 50, Math.random() * -50 + 25, 0],
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0,
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                delay: piece.id * 0.02,
                                ease: "linear",
                            }}
                        />
                    ))}
                </div>
            )}
        </AnimatePresence>
    );
};
