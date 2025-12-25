"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
    staggerContainerVariants,
    staggerItemVariants,
    bobSadVariants,
    flickerVariants,
    springTransition,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

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
        <div className="fixed inset-0 w-screen h-screen z-50 flex flex-col bg-bg-dark-start overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 bg-[url('/assets/bg-network-pattern.png')] bg-cover bg-center opacity-20 pointer-events-none z-0" />

            {/* Content with stagger animation */}
            <motion.div
                className="relative z-10 flex-1 flex flex-col items-center justify-center p-lg gap-xl"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Error Icon */}
                <motion.div
                    className="relative"
                    variants={staggerItemVariants}
                >
                    <motion.div
                        variants={bobSadVariants}
                        animate="animate"
                        initial="initial"
                        className="w-[160px] h-[160px] rounded-full bg-surface-glass backdrop-blur-[20px] border border-surface-glass-border flex items-center justify-center shadow-[0_0_40px_rgba(255,68,68,0.3)]"
                    >
                        <span className="text-[72px]">😔</span>
                    </motion.div>
                    <motion.div
                        className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[60px] h-[3px] bg-linear-to-r from-secondary-purple from-45% via-transparent to-secondary-purple to-55% opacity-60"
                        variants={flickerVariants}
                        animate="animate"
                        initial="initial"
                    />
                </motion.div>

                {/* Text with fade-in */}
                <motion.div
                    className="text-center max-w-[300px]"
                    variants={staggerItemVariants}
                >
                    <motion.h1
                        className="text-[24px] font-bold mb-xs text-white"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        className="text-[15px] text-text-secondary leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {message}
                    </motion.p>
                </motion.div>

                {/* CTAs with stagger */}
                <motion.div
                    className="w-full max-w-[340px] flex flex-col gap-md"
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
