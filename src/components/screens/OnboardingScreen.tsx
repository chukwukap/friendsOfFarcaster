"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAddFrame } from "@coinbase/onchainkit/minikit";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Snowfall } from "@/components/ui/Snowfall";
import { ASSETS } from "@/lib/constants";
import { cn } from "@/lib/utils";


interface OnboardingScreenProps {
    onComplete: () => void;
}

interface OnboardingPage {
    icon: string;
    badge?: { text: string; icon: string };
    title: string;
    description: string;
    decoration?: "snowflakes" | "coins" | "stars";
}

const PAGES: OnboardingPage[] = [
    {
        icon: "👋",
        badge: { text: "Christmas Edition 2025", icon: "🎄" },
        title: "Welcome to FOF",
        description: "Friends on Farcaster transforms your network into stunning AI-generated art",
        decoration: "snowflakes",
    },
    {
        icon: "🎨",
        title: "Your Network, As Art",
        description: "We analyze your closest Farcaster connections and create a unique portrait just for you",
        decoration: "stars",
    },
    {
        icon: "🎉",
        badge: { text: "+100 PTS", icon: "✨" },
        title: "Earn & Share",
        description: "Get Waffles points for each creation. Share your FOF and spread the holiday joy!",
        decoration: "coins",
    },
];

export const OnboardingScreen: FC<OnboardingScreenProps> = ({ onComplete }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const addFrame = useAddFrame();

    const handleNext = async () => {
        if (currentPage < PAGES.length - 1) {
            setCurrentPage((prev) => prev + 1);
        } else {
            setIsLoading(true);
            try {
                // Prompt user to add the mini app with notifications enabled
                await addFrame();
            } catch (error) {
                console.error("Onboarding error:", error);
            } finally {
                setIsLoading(false);
                onComplete();
            }
        }
    };

    const page = PAGES[currentPage];
    const isLastPage = currentPage === PAGES.length - 1;


    return (
        <div className="fixed inset-0 w-screen h-screen z-50 flex flex-col bg-bg-dark-start overflow-hidden">
            {/* Snowfall */}
            <Snowfall count={20} speed="slow" />

            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[url('/assets/bg-network-pattern.png')] bg-cover bg-center" />

            {/* Gradient Overlays - Christmas themed */}
            <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-bg-dark-start/50 to-bg-dark-end/80" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[50%] bg-radial-[ellipse_at_center,rgba(83,52,131,0.4)_0%,rgba(233,69,96,0.2)_40%,transparent_70%] blur-[80px]" />

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-between p-5 pt-[calc(env(safe-area-inset-top,0px)+60px)] pb-[calc(env(safe-area-inset-bottom,0px)+20px)] max-w-[400px] mx-auto w-full">

                {/* Hero Icon */}
                <div className="flex-1 flex items-center justify-center relative min-h-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            className="relative flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            {/* Icon Glow - Gold tinted */}
                            <div className="absolute w-[220px] h-[220px] bg-radial-[circle,rgba(255,215,0,0.3)_0%,rgba(139,92,246,0.2)_40%,transparent_70%] rounded-full blur-[20px]" />

                            {/* Icon Container */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10 w-[180px] h-[180px] rounded-full bg-white/5 backdrop-blur-xl border-2 border-accent-gold/30 flex items-center justify-center shadow-[0_20px_40px_rgba(255,215,0,0.2),0_0_60px_rgba(139,92,246,0.2)]"
                            >
                                <span className="text-[80px]">{page.icon}</span>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Floating decorations */}
                    {page.decoration === "snowflakes" && (
                        <>
                            <motion.span
                                className="absolute top-[-10px] right-[-30px] text-[28px] opacity-70"
                                animate={{ y: [0, -10, 0], rotate: [0, 180, 360] }}
                                transition={{ duration: 6, repeat: Infinity }}
                            >
                                ❄️
                            </motion.span>
                            <motion.span
                                className="absolute bottom-[10px] left-[-25px] text-[22px] opacity-50"
                                animate={{ y: [0, 8, 0], rotate: [360, 180, 0] }}
                                transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
                            >
                                ❄️
                            </motion.span>
                        </>
                    )}
                    {page.decoration === "coins" && (
                        <motion.span
                            className="absolute top-[-10px] right-[-30px] text-[40px] opacity-70"
                            animate={{ y: [0, -6, 0], rotate: [-5, 5, -5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🧇
                        </motion.span>
                    )}
                    {page.decoration === "stars" && (
                        <>
                            <motion.span
                                className="absolute top-0 right-[-20px] text-[24px]"
                                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                ✨
                            </motion.span>
                            <motion.span
                                className="absolute bottom-[20px] left-[-15px] text-[20px]"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                            >
                                ⭐
                            </motion.span>
                        </>
                    )}
                </div>

                {/* Text Section */}
                <div className="shrink-0 text-center px-2 mb-6 max-h-[580px]:mb-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-3"
                        >
                            {/* Badge */}
                            {page.badge && (
                                <motion.div
                                    className="inline-flex items-center gap-[6px] bg-linear-to-r from-accent-gold/20 to-orange-500/20 border border-accent-gold/30 px-4 py-2 rounded-full"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <span className="text-[14px]">{page.badge.icon}</span>
                                    <span className="text-[12px] font-bold text-accent-gold uppercase tracking-[0.5px]">{page.badge.text}</span>
                                </motion.div>
                            )}

                            {/* Title */}
                            <h1 className="font-heading text-[32px] max-h-[680px]:text-[28px] max-h-[580px]:text-[24px] font-bold text-white leading-tight m-0">
                                {page.title}
                            </h1>

                            {/* Description */}
                            <p className="text-[16px] max-h-[680px]:text-[14px] text-white/70 leading-relaxed max-w-[300px] m-0">
                                {page.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom Section */}
                <div className="w-full flex flex-col items-center gap-5 max-h-[580px]:gap-4 shrink-0">
                    {/* Dots */}
                    <div className="flex gap-[10px]">
                        {PAGES.map((_, index) => (
                            <button
                                key={index}
                                className={cn(
                                    "w-[10px] h-[10px] rounded-full bg-white/20 border-none p-0 cursor-pointer transition-all duration-250 hover:bg-white/40",
                                    index === currentPage && "bg-accent-gold scale-120 shadow-[0_0_12px_rgba(255,215,0,0.6)]"
                                )}
                                onClick={() => setCurrentPage(index)}
                                aria-label={`Go to page ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                        variant={isLastPage ? "gold" : "primary"}
                        size="lg"
                        fullWidth
                        onClick={handleNext}
                    >
                        {isLastPage ? "Let's Go! 🚀" : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
