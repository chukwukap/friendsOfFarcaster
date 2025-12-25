"use client";

import { FC, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SnowfallProps {
    count?: number;
    speed?: "slow" | "normal" | "fast";
}

interface Snowflake {
    id: number;
    left: string;
    size: number;
    opacity: number;
    duration: number;
    delay: number;
    swayAmount: number;
}

export const Snowfall: FC<SnowfallProps> = ({ count = 30, speed = "normal" }) => {
    const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
    const speedMultiplier = speed === "slow" ? 1.5 : speed === "fast" ? 0.5 : 1;

    // Generate snowflakes only on client side to avoid hydration mismatch
    useEffect(() => {
        const flakes = Array.from({ length: count }, (_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            size: 4 + Math.random() * 8,
            opacity: 0.3 + Math.random() * 0.5,
            duration: (8 + Math.random() * 6) * speedMultiplier,
            delay: Math.random() * 5,
            swayAmount: 30 + Math.random() * 40,
        }));
        setSnowflakes(flakes);
    }, [count, speedMultiplier]);

    // Don't render anything during SSR
    if (snowflakes.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {snowflakes.map((flake) => (
                <motion.div
                    key={flake.id}
                    className="absolute -top-[10px] rounded-full bg-radial-[circle,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.4)_50%,transparent_100%]"
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
