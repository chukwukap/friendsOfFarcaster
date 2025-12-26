"use client";

import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import sdk from "@farcaster/miniapp-sdk";
import { Button } from "@/components/ui/Button";
import { ASSETS } from "@/lib/constants";
import {
    overlayVariants,
    modalVariants,
} from "@/lib/animations";

interface Generation {
    id: number;
    imageUrl: string;
    friendCount: number;
    sharedOnFarcaster: boolean;
    shareCount: number;
    createdAt: string;
}

interface ImageDetailModalProps {
    generation: Generation | null;
    isOpen: boolean;
    onClose: () => void;
    onShare: (generation: Generation) => void;
    onCreateAnother: () => void;
    username?: string;
}

export const ImageDetailModal: FC<ImageDetailModalProps> = ({
    generation,
    isOpen,
    onClose,
    onShare,
    onCreateAnother,
    username = "you",
}) => {
    if (!generation) return null;

    const formattedDate = new Date(generation.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const handleDownload = async () => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        const downloadUrl = `${baseUrl}/api/download?url=${encodeURIComponent(generation.imageUrl)}&filename=fof-${username}-${generation.id}.png`;
        try {
            await sdk.actions.openUrl({ url: downloadUrl });
        } catch (error) {
            console.error("Download failed:", error);
            window.open(downloadUrl, "_blank");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
                        variants={overlayVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        variants={modalVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <div className="relative w-full max-w-[360px] bg-bg-dark-end/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-colors"
                            >
                                ✕
                            </button>

                            {/* Image */}
                            <div className="relative aspect-square">
                                <Image
                                    src={generation.imageUrl}
                                    alt={`FOF Generation #${generation.id}`}
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-bg-dark-end via-transparent to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-4">
                                {/* Meta info */}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-white font-medium">
                                        @{username} + {generation.friendCount} friends
                                    </span>
                                    <span className="text-text-secondary text-xs">{formattedDate}</span>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-xs text-text-secondary">
                                    {generation.sharedOnFarcaster && (
                                        <span className="flex items-center gap-1">
                                            <span className="text-green-400">✓</span> Shared on Farcaster
                                        </span>
                                    )}
                                    {generation.shareCount > 0 && (
                                        <span>{generation.shareCount} shares</span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="primary"
                                            size="md"
                                            fullWidth
                                            onClick={() => onShare(generation)}
                                            icon={<span>🔮</span>}
                                        >
                                            {generation.sharedOnFarcaster ? "Share Again" : "Share"}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="md"
                                            onClick={handleDownload}
                                            icon={<span>📥</span>}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="md"
                                        fullWidth
                                        onClick={onCreateAnother}
                                    >
                                        Create Another
                                    </Button>
                                </div>
                            </div>

                            {/* Floating decorations */}
                            <div className="absolute top-4 left-4 opacity-30 pointer-events-none">
                                <motion.div
                                    animate={{ rotate: 360, y: [0, -5, 0] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                >
                                    <Image src={ASSETS.snowflake} alt="" width={20} height={20} />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
