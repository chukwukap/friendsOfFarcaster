"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    cardVariants,
    springTransition,
} from "@/lib/animations";

interface GenerationCardProps {
    id: number;
    imageUrl: string;
    friendCount: number;
    sharedOnFarcaster: boolean;
    createdAt: string;
    onClick: () => void;
    index: number;
}

export const GenerationCard: FC<GenerationCardProps> = ({
    id,
    imageUrl,
    friendCount,
    sharedOnFarcaster,
    createdAt,
    onClick,
    index,
}) => {
    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    return (
        <motion.div
            className={cn(
                "relative rounded-xl overflow-hidden cursor-pointer",
                "bg-white/5 backdrop-blur-sm",
                "border-2 border-white/10",
                "transition-all duration-300",
                "hover:border-accent-gold/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]"
            )}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{
                ...springTransition,
                delay: index * 0.05,
            }}
            onClick={onClick}
        >
            {/* Image */}
            <div className="aspect-square relative">
                <Image
                    src={imageUrl}
                    alt={`FOF Generation #${id}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 200px"
                    unoptimized
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                {/* Shared indicator */}
                {sharedOnFarcaster && (
                    <motion.div
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500/90 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.05 + 0.2, type: "spring" }}
                    >
                        <span className="text-white text-xs">✓</span>
                    </motion.div>
                )}

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-white/80 font-medium bg-black/30 px-2 py-0.5 rounded-full">
                            +{friendCount} friends
                        </span>
                        <span className="text-[10px] text-white/60">{formattedDate}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
