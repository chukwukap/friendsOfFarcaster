"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { fadeInVariants, shimmerVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    progress: number;
    message?: string;
}

export const ProgressBar: FC<ProgressBarProps> = ({ progress, message }) => {
    return (
        <motion.div
            className="w-full flex flex-col gap-2"
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
        >
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden relative">
                <motion.div
                    className="h-full bg-linear-to-r from-secondary-purple to-accent-gold rounded-full relative"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                >
                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent"
                        variants={shimmerVariants}
                        animate="animate"
                        initial="initial"
                    />
                </motion.div>
            </div>
            {message && (
                <motion.p
                    className="text-sm text-text-secondary text-center"
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
