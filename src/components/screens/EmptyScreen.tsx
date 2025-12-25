"use client";

import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ASSETS } from "@/lib/constants";
import {
    mascotVariants,
    pulseRippleVariants,
    floatSnowVariants
} from "@/lib/animations";

interface EmptyScreenProps {
    onGenerate: () => void;
}

export const EmptyScreen: FC<EmptyScreenProps> = ({ onGenerate }) => {
    return (
        <div className="min-h-screen min-h-[100dvh] flex flex-col relative overflow-hidden bg-bg-dark-start">
            {/* Background */}
            <div className="fixed inset-0 bg-[url('/assets/bg-network-pattern.png')] bg-cover bg-center opacity-25 pointer-events-none z-0" />

            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-lg gap-xl">
                {/* Mascot with empty frame */}
                <div className="flex items-center gap-lg">
                    <motion.div
                        variants={mascotVariants}
                        animate="idle"
                    >
                        <Image
                            src={ASSETS.mascotDefault}
                            alt="FOF Mascot"
                            width={140}
                            height={140}
                            priority
                        />
                    </motion.div>
                    <motion.div
                        className="w-[120px] h-[120px] border-2 border-dashed border-accent-gold/40 rounded-lg flex items-center justify-center bg-white/[0.02]"
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
                    <Image
                        src={ASSETS.snowflake}
                        alt=""
                        width={36}
                        height={36}
                        aria-hidden
                    />
                </motion.div>
            </div>
        </div>
    );
};
