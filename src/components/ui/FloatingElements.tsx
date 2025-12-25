"use client";

import { FC } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ASSETS } from "@/lib/constants";
import {
    float1Variants,
    float2Variants,
    float3Variants,
    floatGiftVariants,
    floatCoinVariants,
    spinSlowVariants,
    orbitVariants
} from "@/lib/animations";

interface FloatingElementsProps {
    variant?: "landing" | "generating" | "success";
}

export const FloatingElements: FC<FloatingElementsProps> = ({ variant = "landing" }) => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-1">
            {/* Snowflakes */}
            <motion.div
                className="absolute top-[8%] right-[8%] opacity-70"
                variants={float1Variants}
                animate="animate"
                initial="initial"
            >
                <Image
                    src={ASSETS.snowflake}
                    alt=""
                    width={40}
                    height={40}
                    aria-hidden
                />
            </motion.div>
            <motion.div
                className="absolute top-[25%] left-[5%] opacity-50"
                variants={float2Variants}
                animate="animate"
                initial="initial"
            >
                <Image
                    src={ASSETS.snowflake}
                    alt=""
                    width={28}
                    height={28}
                    aria-hidden
                />
            </motion.div>
            <motion.div
                className="absolute bottom-[30%] right-[10%] opacity-60"
                variants={float3Variants}
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

            {/* Variant-specific elements */}
            {variant === "landing" && (
                <motion.div
                    className="absolute bottom-[15%] left-[8%] drop-shadow-[0_10px_40px_rgba(255,215,0,0.4)]"
                    variants={floatGiftVariants}
                    animate="animate"
                    initial="initial"
                >
                    <Image
                        src={ASSETS.giftBox}
                        alt=""
                        width={60}
                        height={60}
                        aria-hidden
                    />
                </motion.div>
            )}

            {variant === "success" && (
                <>
                    <motion.div
                        className="absolute top-[15%] left-[12%] drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]"
                        variants={spinSlowVariants}
                        animate="animate"
                        initial="initial"
                    >
                        <Image
                            src={ASSETS.star}
                            alt=""
                            width={32}
                            height={32}
                            aria-hidden
                        />
                    </motion.div>
                    <motion.div
                        className="absolute bottom-[25%] right-[8%] drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]"
                        variants={floatCoinVariants}
                        animate="animate"
                        initial="initial"
                    >
                        <Image
                            src={ASSETS.wafflesCoin}
                            alt=""
                            width={48}
                            height={48}
                            aria-hidden
                        />
                    </motion.div>
                </>
            )}

            {variant === "generating" && (
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    variants={orbitVariants}
                    animate="animate"
                >
                    <Image
                        src={ASSETS.snowflake}
                        alt=""
                        width={24}
                        height={24}
                        aria-hidden
                    />
                </motion.div>
            )}
        </div>
    );
};
