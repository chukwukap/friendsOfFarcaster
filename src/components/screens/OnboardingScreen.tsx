"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAddFrame } from "@coinbase/onchainkit/minikit";
import { Button } from "@/components/ui/Button";
import { ASSETS } from "@/lib/constants";
import { cn } from "@/lib/utils";


interface OnboardingScreenProps {
    onComplete: () => void;
}

interface OnboardingPage {
    mascot: string;
    badge?: { text: string; icon: string };
    title: string;
    description: string;
    decoration?: "snowflakes" | "coins" | "stars";
}

const PAGES: OnboardingPage[] = [
    {
        mascot: "/assets/mascot-waving.png",
        badge: { text: "Christmas Edition 2025", icon: "🎄" },
        title: "Welcome to FOF",
        description: "Friends of Farcaster transforms your network into stunning AI-generated art",
        decoration: "snowflakes",
    },
    {
        mascot: "/assets/mascot-default.png",
        title: "Your Network, As Art",
        description: "We analyze your closest Farcaster connections and create a unique portrait just for you",
        decoration: "stars",
    },
    {
        mascot: "/assets/mascot-celebrating.png",
        badge: { text: "+100 PTS", icon: "✨" },
        title: "Earn & Share",
        description: "Get Waffles points for each creation. Share your FOF and spread the holiday joy!",
        decoration: "coins",
    },
];

export const OnboardingScreen: FC<OnboardingScreenProps> = ({ onComplete }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const addFrame = useAddFrame();

    const handleNext = async () => {
        if (currentPage < PAGES.length - 1) {
            setCurrentPage((prev) => prev + 1);
        } else {
            // Prompt user to add the mini app with notifications enabled
            try {
                await addFrame();
            } catch (error) {
                console.error("Failed to add frame:", error);
            }
            onComplete();
        }
    };

    const page = PAGES[currentPage];
    const isLastPage = currentPage === PAGES.length - 1;


    return (
        <div className="h-screen h-[100dvh] flex flex-col relative overflow-hidden bg-linear-to-b from-[#0f0a1a] via-[#1a0f2e] to-[#0d0815]">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-[url('/assets/bg-network-pattern.png')] bg-cover bg-center no-repeat" />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 pointer-events-none bg-radial-[ellipse_80%_50%_at_50%_0%] from-violet-500/25 to-transparent" />
            <div className="absolute inset-0 pointer-events-none bg-radial-[ellipse_60%_40%_at_50%_100%] from-purple-500/15 to-transparent" />

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-between p-5 pt-[calc(env(safe-area-inset-top,0px)+60px)] pb-[calc(env(safe-area-inset-bottom,0px)+20px)] max-w-[400px] mx-auto w-full">

                {/* Mascot Hero */}
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
                            {/* Mascot Glow */}
                            <div className="absolute w-[220px] h-[220px] max-h-[680px]:w-[180px] max-h-[680px]:h-[180px] max-h-[580px]:w-[140px] max-h-[580px]:h-[140px] bg-radial-[circle,rgba(139,92,246,0.5)_0%,rgba(139,92,246,0.2)_40%,transparent_70%] rounded-full blur-[20px] animate-[pulse-glow_2.5s_ease-in-out_infinite]" />

                            {/* Mascot Image */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10 drop-shadow-[0_20px_40px_rgba(139,92,246,0.4)]"
                            >
                                <Image
                                    src={page.mascot}
                                    alt="FOF Mascot"
                                    width={200}
                                    height={200}
                                    className="max-h-[680px]:w-[160px] max-h-[680px]:h-[160px] max-h-[580px]:w-[120px] max-h-[580px]:h-[120px]"
                                    priority
                                />
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Floating decorations */}
                    {page.decoration === "snowflakes" && (
                        <>
                            <motion.div
                                className="absolute top-[-10px] right-[-30px] opacity-70"
                                animate={{ y: [0, -10, 0], rotate: [0, 180, 360] }}
                                transition={{ duration: 6, repeat: Infinity }}
                            >
                                <Image src={ASSETS.snowflake} alt="" width={28} height={28} />
                            </motion.div>
                            <motion.div
                                className="absolute bottom-[10px] left-[-25px] opacity-50"
                                animate={{ y: [0, 8, 0], rotate: [360, 180, 0] }}
                                transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
                            >
                                <Image src={ASSETS.snowflake} alt="" width={22} height={22} />
                            </motion.div>
                        </>
                    )}
                    {page.decoration === "coins" && (
                        <motion.div
                            className="absolute top-[-10px] right-[-30px] opacity-70"
                            animate={{ y: [0, -6, 0], rotate: [-5, 5, -5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Image src={ASSETS.wafflesCoin} alt="" width={40} height={40} />
                        </motion.div>
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
                                    className="inline-flex items-center gap-[6px] bg-linear-[135deg,rgba(139,92,246,0.9)_0%,rgba(109,40,217,0.9)_100%] border border-white/20 px-4 py-2 rounded-full shadow-[0_4px_16px_rgba(139,92,246,0.4)] inner-shadow-[0_1px_0_rgba(255,255,255,0.15)]"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <span className="text-[14px]">{page.badge.icon}</span>
                                    <span className="text-[12px] font-bold text-white uppercase tracking-[0.5px]">{page.badge.text}</span>
                                </motion.div>
                            )}

                            {/* Title */}
                            <h1 className="font-heading text-[32px] max-h-[680px]:text-[28px] max-h-[580px]:text-[24px] font-bold text-white leading-tight m-0">
                                {page.title}
                            </h1>

                            {/* Description */}
                            <p className="text-[16px] max-h-[680px]:text-[14px] color-white/70 leading-relaxed max-w-[300px] m-0">
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
                                    index === currentPage && "bg-linear-[135deg,#8b5cf6,#6d28d9] scale-120 shadow-[0_0_12px_rgba(139,92,246,0.6)]"
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
