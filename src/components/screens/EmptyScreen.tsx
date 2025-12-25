"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
    pulseRippleVariants,
    floatSnowVariants
} from "@/lib/animations";

interface EmptyScreenProps {
    onGenerate: () => void;
}

export const EmptyScreen: FC<EmptyScreenProps> = ({ onGenerate }) => {
    return (
        <div className="fixed inset-0 w-screen h-screen z-50 flex flex-col bg-bg-dark-start overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 bg-[url('/assets/bg-network-pattern.png')] bg-cover bg-center opacity-25 pointer-events-none z-0" />

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-lg gap-xl">
                {/* Empty State Icon */}
                <div className="flex items-center gap-lg">
                    <motion.div
                        className="w-[140px] h-[140px] rounded-full bg-surface-glass backdrop-blur-[20px] border border-surface-glass-border flex items-center justify-center shadow-[0_0_40px_var(--glow-purple)]"
                        variants={pulseRippleVariants}
                        animate="animate"
                        initial="initial"
                    >
                        <span className="text-[64px]">🎄</span>
                    </motion.div>
                    <motion.div
                        className="w-[120px] h-[120px] border-2 border-dashed border-accent-gold/40 rounded-lg flex items-center justify-center bg-white/2"
                        variants={pulseRippleVariants}
                        animate="animate"
                        initial="initial"
                    >
                        <span className="text-[48px] font-bold text-accent-gold/40">?</span>
                    </motion.div>
                </div>

                {/* Text */}
                <div className="text-center max-w-[280px]">
                    <h1 className="text-[24px] font-bold mb-xs text-white">No FOF Yet</h1>
                    <p className="text-[15px] text-text-secondary leading-relaxed">
                        Create your first Friends of Farcaster portrait!
                    </p>
                </div>

                {/* CTA */}
                <div className="w-full max-w-[340px]">
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={onGenerate}
                        icon={<span>✨</span>}
                    >
                        Generate My FOF
                    </Button>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-[15%] right-[12%] opacity-50"
                    variants={floatSnowVariants}
                    animate="animate"
                    initial="initial"
                >
                    <span className="text-[36px]">❄️</span>
                </motion.div>
            </div>
        </div>
    );
};
