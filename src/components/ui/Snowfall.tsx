"use client";

import { FC, useMemo } from "react";
import { motion } from "framer-motion";
import styles from "./Snowfall.module.css";

interface SnowfallProps {
    count?: number;
    speed?: "slow" | "normal" | "fast";
}

export const Snowfall: FC<SnowfallProps> = ({ count = 30, speed = "normal" }) => {
    const speedMultiplier = speed === "slow" ? 1.5 : speed === "fast" ? 0.5 : 1;

    const snowflakes = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: 4 + Math.random() * 8,
            opacity: 0.3 + Math.random() * 0.5,
            duration: (8 + Math.random() * 6) * speedMultiplier,
            delay: Math.random() * 5,
            swayAmount: 30 + Math.random() * 40,
        }));
    }, [count, speedMultiplier]);

    return (
        <div className={styles.container}>
            {snowflakes.map((flake) => (
                <motion.div
                    key={flake.id}
                    className={styles.snowflake}
                    style={{
                        left: flake.left,
                        width: flake.size,
                        height: flake.size,
                    }}
                    initial={{
                        y: -20,
                        x: 0,
                        opacity: 0,
                        rotate: 0,
                    }}
                    animate={{
                        y: "100vh",
                        x: [0, flake.swayAmount, -flake.swayAmount, 0],
                        opacity: [0, flake.opacity, flake.opacity, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: flake.duration,
                        delay: flake.delay,
                        repeat: Infinity,
                        ease: "linear",
                        x: {
                            duration: flake.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                        },
                    }}
                />
            ))}
        </div>
    );
};
