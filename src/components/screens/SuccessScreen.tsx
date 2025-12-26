"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { GalleryButton } from "@/components/ui/GalleryButton";
import { PointsBadge } from "@/components/ui/PointsBadge";
import { FAQ } from "@/components/ui/FAQ";
import { WafflesFooter } from "@/components/ui/WafflesFooter";
import { ASSETS, APP_CONFIG } from "@/lib/constants";
import {
    staggerContainerVariants,
    staggerItemVariants,

} from "@/lib/animations";
import sdk from "@farcaster/miniapp-sdk";

interface SuccessScreenProps {
    imageUrl: string;
    username: string;
    displayName: string;
    friendCount: number;
    onShare: () => void;
    onBack: () => void;
    onViewGallery?: () => void;
}

export const SuccessScreen: FC<SuccessScreenProps> = ({
    imageUrl,
    username,
    displayName,
    friendCount,
    onShare,
    onBack,
    onViewGallery,
}) => {
    const handleOpenWaffles = async () => {
        try {
            await sdk.actions.openMiniApp({ url: APP_CONFIG.wafflesMiniappUrl });
        } catch (error) {
            console.error("Failed to open Waffles MiniApp:", error);
            // Fallback for web view testing
            window.open(APP_CONFIG.wafflesMiniappUrl, "_blank");
        }
    };

    const handleDownload = async () => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        const downloadUrl = `${baseUrl}/api/download?url=${encodeURIComponent(imageUrl)}&filename=fof-${username}-${Date.now()}.png`;
        try {
            await sdk.actions.openUrl({ url: downloadUrl });
        } catch (error) {
            console.error("Download failed:", error);
            window.open(downloadUrl, "_blank");
        }
    };

    return (
        <div className="min-h-dvh flex flex-col relative overflow-x-hidden bg-bg-dark-start">
            {/* Celebration Background */}
            <motion.div
                className="fixed inset-0 w-full h-full bg-linear-to-b from-bg-dark-start to-bg-dark-end z-0 before:content-[''] before:absolute before:inset-0 before:bg-[url('/assets/bg-celebration.png')] before:bg-cover before:bg-center before:bg-no-repeat before:opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            />

            {/* Content */}
            <motion.div
                className="relative z-10 flex flex-col items-center px-5 py-6 pt-[calc(env(safe-area-inset-top,12px)+12px)] pb-[calc(env(safe-area-inset-bottom,12px)+12px)] max-w-[400px] mx-auto w-full gap-4"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Header */}
                <motion.div className="text-center" variants={staggerItemVariants}>
                    <motion.h1
                        className="text-[26px] font-bold mb-1 text-white"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        🎉 Your FOF is Ready!
                    </motion.h1>
                    <motion.p
                        className="text-[14px] text-text-secondary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Here&apos;s your FOF: {APP_CONFIG.edition}
                    </motion.p>
                </motion.div>

                {/* Generated Image */}
                <div className="relative rounded-xl overflow-hidden border-[3px] border-accent-gold shadow-[0_0_60px_rgba(255,215,0,0.3)]">
                    <Image
                        src={imageUrl}
                        alt={`${displayName}'s FOF`}
                        width={280}
                        height={280}
                        className="block w-full h-auto max-w-[260px]"
                        priority
                        unoptimized
                    />
                </div>

                {/* User Info */}
                <motion.div className="flex items-center gap-2 text-white" variants={staggerItemVariants}>
                    <span className="text-[18px] font-semibold">@{username}</span>
                    <span className="text-[14px] text-text-secondary">+ {friendCount} friends</span>
                </motion.div>

                {/* Waffles Bonus Card */}
                <motion.div
                    className="w-full bg-linear-to-r from-accent-gold/20 to-orange-500/20 border border-accent-gold/30 rounded-xl p-4"
                    variants={staggerItemVariants}
                >
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-[14px] text-white font-medium text-center">
                            🧇 Get <span className="text-accent-gold font-bold">+{APP_CONFIG.wafflesBonusPoints.toLocaleString()}</span> points for checking out Waffles!
                        </p>
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleOpenWaffles}
                            icon={<span>🎮</span>}
                        >
                            Learn More about Waffles
                        </Button>
                    </div>
                </motion.div>

                {/* Generation Points */}
                <motion.div className="flex flex-col items-center gap-1" variants={staggerItemVariants}>
                    <span className="text-[13px] text-text-secondary">✨ You earned</span>
                    <PointsBadge points={APP_CONFIG.pointsForGeneration} size="md" />
                </motion.div>

                {/* Action Buttons */}
                <motion.div className="w-full flex flex-col gap-2" variants={staggerContainerVariants}>
                    <motion.div className="flex gap-2 w-full" variants={staggerItemVariants}>
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={onShare}
                            icon={<span>🔮</span>}
                        >
                            Share
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleDownload}
                            icon={<span>📥</span>}
                        >
                            Save
                        </Button>
                    </motion.div>

                    <motion.div className="flex gap-2 w-full" variants={staggerItemVariants}>
                        <Button
                            variant="ghost"
                            size="md"
                            fullWidth
                            onClick={onBack}
                        >
                            Create Another
                        </Button>
                        {onViewGallery && (
                            <div className="w-full pt-2">
                                <GalleryButton onClick={onViewGallery} />
                            </div>
                        )}
                    </motion.div>
                </motion.div>

                {/* FAQ Section */}
                <FAQ />

                {/* Footer */}
                <WafflesFooter />
            </motion.div>

            {/* Floating Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    className="absolute top-[15%] right-[10%] opacity-60"
                    animate={{ y: [0, -20, 0], rotate: [0, 360], scale: [1, 1.1, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Image src={ASSETS.snowflake} alt="" width={32} height={32} />
                </motion.div>
                <motion.div
                    className="absolute bottom-[25%] left-[8%] opacity-70"
                    animate={{ y: [0, 15, 0], rotate: [0, -360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                    <Image src={ASSETS.star} alt="" width={28} height={28} />
                </motion.div>
            </div>
        </div>
    );
};
