"use client";

import { FC, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import sdk from "@farcaster/miniapp-sdk";
import { Button } from "@/components/ui/Button";
import { GenerationCard } from "@/components/ui/GenerationCard";
import { ImageDetailModal } from "@/components/ui/ImageDetailModal";
import { PointsBadge } from "@/components/ui/PointsBadge";
import { Snowfall } from "@/components/ui/Snowfall";
import { WafflesFooter } from "@/components/ui/WafflesFooter";
import { ASSETS, APP_CONFIG } from "@/lib/constants";
import {
    staggerContainerVariants,
    staggerItemVariants,
    scaleInVariants,
} from "@/lib/animations";

interface Generation {
    id: number;
    imageUrl: string;
    friendCount: number;
    sharedOnFarcaster: boolean;
    shareCount: number;
    createdAt: string;
}

interface GalleryScreenProps {
    onBack: () => void;
    onCreateNew: () => void;
    username?: string;
    onShare?: (generationId: number, imageUrl: string, friendCount: number) => void;
}

export const GalleryScreen: FC<GalleryScreenProps> = ({
    onBack,
    onCreateNew,
    username = "you",
    onShare,
}) => {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);

    // Fetch generations on mount
    useEffect(() => {
        const fetchGenerations = async () => {
            try {
                setIsLoading(true);
                const res = await sdk.quickAuth.fetch("/api/me/generations");

                if (!res.ok) {
                    throw new Error("Failed to fetch generations");
                }

                const data = await res.json();
                setGenerations(data.generations || []);
                setTotalPoints(data.totalPoints || 0);
            } catch (err) {
                console.error("Error fetching generations:", err);
                setError("Failed to load your gallery");
            } finally {
                setIsLoading(false);
            }
        };

        fetchGenerations();
    }, []);

    const handleSelectGeneration = useCallback((gen: Generation) => {
        setSelectedGeneration(gen);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedGeneration(null);
    }, []);

    const handleShare = useCallback((gen: Generation) => {
        if (onShare) {
            onShare(gen.id, gen.imageUrl, gen.friendCount);
        }
        handleCloseModal();
    }, [onShare, handleCloseModal]);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-dvh flex flex-col items-center justify-center bg-bg-dark-start">
                <motion.div
                    className="w-12 h-12 border-4 border-white/20 border-t-accent-gold rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="mt-4 text-text-secondary text-sm">Loading your gallery...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-dvh flex flex-col items-center justify-center bg-bg-dark-start p-6">
                <p className="text-red-400 text-center mb-4">{error}</p>
                <Button variant="secondary" size="md" onClick={onBack}>
                    Go Back
                </Button>
            </div>
        );
    }

    // Empty state
    if (generations.length === 0) {
        return (
            <div className="min-h-dvh flex flex-col relative overflow-hidden bg-bg-dark-start">
                <Snowfall count={20} speed="slow" />

                <motion.div
                    className="flex-1 flex flex-col items-center justify-center px-6 py-8"
                    variants={staggerContainerVariants}
                    initial="initial"
                    animate="animate"
                >
                    {/* Floating decoration */}
                    <motion.div
                        className="mb-6 opacity-60"
                        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Image src={ASSETS.snowflake} alt="" width={64} height={64} />
                    </motion.div>

                    <motion.h2
                        className="text-2xl font-bold text-white text-center mb-2"
                        variants={staggerItemVariants}
                    >
                        No FOF Generations Yet
                    </motion.h2>

                    <motion.p
                        className="text-text-secondary text-center text-sm mb-8 max-w-[280px]"
                        variants={staggerItemVariants}
                    >
                        Create your first Friends on Farcaster portrait and see it appear here!
                    </motion.p>

                    <motion.div variants={scaleInVariants}>
                        <Button
                            variant="gold"
                            size="lg"
                            onClick={onCreateNew}
                            icon={<span>✨</span>}
                        >
                            Create My First FOF
                        </Button>
                    </motion.div>

                    <motion.div className="mt-6" variants={staggerItemVariants}>
                        <Button variant="ghost" size="md" onClick={onBack}>
                            Back to Home
                        </Button>
                    </motion.div>
                </motion.div>

                <WafflesFooter />
            </div>
        );
    }

    // Gallery with generations
    return (
        <div className="min-h-dvh flex flex-col relative bg-bg-dark-start">
            <Snowfall count={15} speed="slow" />

            <motion.div
                className="relative z-10 flex flex-col px-4 py-6 pt-[calc(env(safe-area-inset-top,12px)+12px)] pb-[calc(env(safe-area-inset-bottom,12px)+12px)] max-w-[420px] mx-auto w-full"
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Header */}
                <motion.div
                    className="flex items-center justify-between mb-6"
                    variants={staggerItemVariants}
                >
                    <div>
                        <h1 className="text-2xl font-bold text-white">My Gallery</h1>
                        <p className="text-xs text-text-secondary mt-0.5">
                            {generations.length} generation{generations.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <PointsBadge points={totalPoints} size="sm" />
                </motion.div>

                {/* Grid */}
                <motion.div
                    className="grid grid-cols-2 gap-3 mb-6"
                    variants={staggerContainerVariants}
                >
                    {generations.map((gen, index) => (
                        <GenerationCard
                            key={gen.id}
                            id={gen.id}
                            imageUrl={gen.imageUrl}
                            friendCount={gen.friendCount}
                            sharedOnFarcaster={gen.sharedOnFarcaster}
                            createdAt={gen.createdAt}
                            onClick={() => handleSelectGeneration(gen)}
                            index={index}
                        />
                    ))}
                </motion.div>

                {/* Actions */}
                <motion.div className="flex flex-col gap-2" variants={staggerItemVariants}>
                    <Button
                        variant="gold"
                        size="lg"
                        fullWidth
                        onClick={onCreateNew}
                        icon={<span>✨</span>}
                    >
                        Create New FOF
                    </Button>
                    <Button variant="ghost" size="md" fullWidth onClick={onBack}>
                        Back to Home
                    </Button>
                </motion.div>

                {/* Footer */}
                <div className="mt-6">
                    <WafflesFooter />
                </div>
            </motion.div>

            {/* Image Detail Modal */}
            <ImageDetailModal
                generation={selectedGeneration}
                isOpen={!!selectedGeneration}
                onClose={handleCloseModal}
                onShare={handleShare}
                onCreateAnother={() => {
                    handleCloseModal();
                    onCreateNew();
                }}
                username={username}
            />
        </div>
    );
};
