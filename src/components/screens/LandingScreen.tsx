"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FAQ } from "@/components/ui/FAQ";
import { WafflesFooter } from "@/components/ui/WafflesFooter";
import { ASSETS, APP_CONFIG } from "@/lib/constants";
import {
    staggerContainerVariants,
    staggerItemVariants,
    scaleInVariants,
    springTransition,
} from "@/lib/animations";

interface LandingScreenProps {
    onGenerate: () => void;
    isLoading: boolean;
    buttonText: string;
    error?: string;
}

export const LandingScreen: FC<LandingScreenProps> = ({
    onGenerate,
    isLoading,
    buttonText,
    error,
}) => {
    return (
        <div className="min-h-dvh flex flex-col relative overflow-x-hidden bg-bg-dark-start">
            {/* Background Layer - Fixed to viewport */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('/assets/bg-network-pattern.png')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-bg-dark-start/50 to-bg-dark-end/80" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[50%] bg-radial-[ellipse_at_center,rgba(83,52,131,0.4)_0%,rgba(233,69,96,0.2)_40%,transparent_70%] blur-[80px]" />
            </div>

            {/* Main Content - Scrollable */}
            <motion.div
                className="relative z-10 flex flex-col items-center px-5 py-6 pt-[calc(env(safe-area-inset-top,16px)+16px)] pb-[calc(env(safe-area-inset-bottom,16px)+16px)] max-w-[400px] mx-auto w-full gap-6"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Preview Card with Glass Effect */}
                <motion.section className="w-full flex justify-center" variants={scaleInVariants}>
                    <Card
                        glow="gold"
                        className="p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_60px_rgba(255,215,0,0.1)]"
                        hoverable
                    >
                        <div className="relative rounded-xl overflow-hidden">
                            <Image
                                src="/assets/sample-fof.png"
                                alt="Sample FOF"
                                width={340}
                                height={340}
                                className="block w-full max-w-[320px] h-auto object-cover rounded-lg"
                                priority
                                unoptimized
                            />
                        </div>
                    </Card>
                </motion.section>

                {/* Value Proposition */}
                <motion.section className="text-center px-2" variants={staggerItemVariants}>
                    <h1 className="font-heading text-[24px] font-bold leading-tight mb-2 text-white">
                        Farcaster Friends
                        <br />
                        <span className="bg-linear-to-r from-accent-gold via-primary-red to-secondary-purple bg-clip-text text-transparent">
                            Christmas Edition
                        </span>
                    </h1>
                    <p className="text-[14px] text-text-secondary/90 leading-relaxed max-w-[300px] mx-auto">
                        Get your personalized Farcaster Friends portrait — celebrating your network this holiday season
                    </p>
                </motion.section>

                {/* Airdrop Banner */}
                <motion.div
                    className="w-full bg-linear-to-r from-accent-gold/20 to-orange-500/20 border border-accent-gold/30 rounded-xl p-3 text-center"
                    variants={staggerItemVariants}
                >
                    <p className="text-[13px] text-white font-medium">
                        🎁 <span className="text-accent-gold font-bold">{APP_CONFIG.airdropPercent}%</span> of $FOF supply allocated to airdrop for users
                    </p>
                </motion.div>

                {/* CTA Section */}
                <motion.section className="w-full flex flex-col gap-3" variants={staggerContainerVariants}>
                    <motion.div variants={staggerItemVariants}>
                        <Button
                            variant="gold"
                            size="lg"
                            fullWidth
                            onClick={onGenerate}
                            loading={isLoading}
                            icon={<span>✨</span>}
                        >
                            {buttonText}
                        </Button>
                    </motion.div>
                    {error && (
                        <motion.p
                            className="text-center text-[12px] text-red-400"
                            variants={staggerItemVariants}
                        >
                            {error}
                        </motion.p>
                    )}
                    <motion.p
                        className="text-center text-[11px] text-text-secondary/70"
                        variants={staggerItemVariants}
                    >
                        Eligible for $FOF airdrop + {APP_CONFIG.wafflesBonusPoints.toLocaleString()} Waffles points
                    </motion.p>
                </motion.section>

                {/* FAQ Section */}
                <FAQ />

                {/* Footer */}
                <WafflesFooter />
            </motion.div>

            {/* Floating Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div
                    className="absolute top-[12%] right-[8%] opacity-40"
                    animate={{ y: [0, -8, 0], rotate: [0, 180, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Image src={ASSETS.snowflake} alt="" width={24} height={24} />
                </motion.div>
                <motion.div
                    className="absolute bottom-[25%] left-[6%] opacity-25"
                    animate={{ y: [0, 8, 0], rotate: [0, -90, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                    <Image src={ASSETS.snowflake} alt="" width={20} height={20} />
                </motion.div>
                <motion.div
                    className="absolute top-[20%] left-[12%] text-[16px] opacity-30"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    ✨
                </motion.div>
            </div>
        </div>
    );
};
