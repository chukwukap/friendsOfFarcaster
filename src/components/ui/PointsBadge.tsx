"use client";

import { FC, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { pointsPopVariants, sparkleVariants, goldShimmerVariants, springTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";

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

    const sizeStyles = {
        sm: "py-[6px] px-[14px] text-[16px]",
        md: "py-[10px] px-[20px] text-[22px]",
        lg: "py-[14px] px-[28px] text-[30px]"
    };

    const iconSizes = {
        sm: "text-[16px]",
        md: "text-[20px]",
        lg: "text-[26px]"
    };

    const labelSizes = {
        sm: "text-[11px]",
        md: "text-[14px]",
        lg: "text-[18px]"
    };

    return (
        <motion.div
            className={cn(
                "inline-flex items-center gap-2 relative overflow-visible rounded-full",
                "bg-linear-to-b from-[#fff9e6] via-[#ffeeb8] to-[#ffdd66]",
                "border-r-[4px] border-b-[4px] border-[#d4a300]",
                "border-t border-l border-yellow-400/50",
                "shadow-[0_4px_16px_rgba(255,193,7,0.35)] inner-shadow-[0_1px_0_white/80]",
                sizeStyles[size]
            )}
            variants={pointsPopVariants}
            initial="initial"
            animate="animate"
            whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(255, 215, 0, 0.5)",
            }}
            transition={springTransition}
        >
            {/* Gold Shimmer Overlay */}
            <motion.div
                className="absolute inset-0 rounded-full pointer-events-none z-10 bg-linear-[105deg,transparent_35%,rgba(255,255,255,0.5)_50%,transparent_65%] bg-[length:200%_100%]"
                variants={goldShimmerVariants}
                animate="animate"
                initial="initial"
            />

            {/* Sparkle effects */}
            <AnimatePresence>
                {showSparkle && (
                    <>
                        <motion.span
                            className="absolute text-[16px] pointer-events-none z-10"
                            style={{ top: "-10px", left: "20%" }}
                            variants={sparkleVariants}
                            initial="initial"
                            animate="animate"
                            exit={{ opacity: 0, scale: 0 }}
                        >
                            ✨
                        </motion.span>
                        <motion.span
                            className="absolute text-[16px] pointer-events-none z-10"
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
                            className="absolute text-[16px] pointer-events-none z-10"
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
                className={cn("drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]", iconSizes[size])}
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
                className={cn(
                    "font-heading font-extrabold text-[#78350f] tracking-tight text-shadow-[0_1px_0_rgba(255,255,255,0.5)]",
                    size === "sm" ? "text-[16px]" : size === "md" ? "text-[22px]" : "text-[30px]"
                )}
                key={displayPoints}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.1 }}
            >
                +{displayPoints}
            </motion.span>

            {/* Label */}
            <span className={cn(
                "font-body font-bold text-[#92400e] uppercase tracking-wider",
                labelSizes[size]
            )}>
                pts
            </span>
        </motion.div>
    );
};
