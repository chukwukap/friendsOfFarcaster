"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ASSETS, APP_CONFIG } from "@/lib/constants";
import {
    staggerContainerVariants,
    staggerItemVariants,
    floatVariants,
    scaleInVariants,
    springTransition,
} from "@/lib/animations";
import styles from "./LandingScreen.module.css";

interface LandingScreenProps {
    onFreeAccess: () => void;
    onPaidAccess: () => void;
    onJoinWaitlist: () => void;
    isConnecting: boolean;
    isPaying: boolean;
    // Waitlist status
    isOnWaitlist: boolean;
    isCheckingWaitlist: boolean;
    discountPercent: number;
    originalPrice: number;
    discountedPrice: number;
}

export const LandingScreen: FC<LandingScreenProps> = ({
    onFreeAccess,
    onPaidAccess,
    onJoinWaitlist,
    isConnecting,
    isPaying,
    isOnWaitlist,
    isCheckingWaitlist,
    discountPercent,
    originalPrice,
    discountedPrice,
}) => {
    return (
        <div className={styles.container}>
            {/* Background */}
            <div className={styles.networkBg} />

            {/* Content with stagger animation */}
            <motion.div
                className={styles.content}
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Logo */}
                <motion.div className={styles.logo} variants={staggerItemVariants}>
                    <Image
                        src={ASSETS.logo}
                        alt="FOF"
                        width={120}
                        height={48}
                        priority
                    />
                    <motion.span
                        className={styles.tagline}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, ...springTransition }}
                    >
                        Friends of Farcaster
                    </motion.span>
                </motion.div>

                {/* Hero 3D Element with float animation */}
                <motion.div
                    className={styles.hero}
                    variants={staggerItemVariants}
                >
                    <motion.div
                        variants={floatVariants}
                        initial="initial"
                        animate="animate"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={springTransition}
                    >
                        <Image
                            src={ASSETS.giftBox}
                            alt="Gift"
                            width={160}
                            height={160}
                            className={styles.giftBox}
                        />
                    </motion.div>
                </motion.div>

                {/* Preview Card with scale-in */}
                <motion.div variants={scaleInVariants}>
                    <Card glow="purple" className={styles.previewCard} hoverable>
                        <Image
                            src="/assets/sample-fof.png"
                            alt="Sample FOF"
                            width={240}
                            height={240}
                            className={styles.previewImage}
                        />
                        <motion.span
                            className={styles.badge}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, ...springTransition }}
                        >
                            {APP_CONFIG.edition}
                        </motion.span>
                    </Card>
                </motion.div>

                {/* Value Prop */}
                <motion.div className={styles.valueProp} variants={staggerItemVariants}>
                    <h1 className={styles.title}>
                        Your Farcaster network,
                        <br />
                        <motion.span
                            className="text-gradient"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            transformed into art.
                        </motion.span>
                    </h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Get your personalized Friends of Farcaster image — celebrating your network this holiday
                    </motion.p>
                </motion.div>

                {/* Two-Path CTAs with stagger */}
                <motion.div
                    className={styles.ctas}
                    variants={staggerContainerVariants}
                >
                    {isOnWaitlist ? (
                        <>
                            {/* Waitlist Member: Show 50% Discount */}
                            <motion.div variants={staggerItemVariants}>
                                <div className={styles.discountBadge}>
                                    🎉 {discountPercent}% OFF - Waitlist Member!
                                </div>
                            </motion.div>
                            <motion.div variants={staggerItemVariants}>
                                <Button
                                    variant="gold"
                                    size="lg"
                                    fullWidth
                                    onClick={onPaidAccess}
                                    loading={isPaying}
                                    icon={<span>✨</span>}
                                >
                                    Generate FOF • ${discountedPrice.toFixed(2)}
                                    <span className={styles.strikePrice}>${originalPrice.toFixed(2)}</span>
                                </Button>
                            </motion.div>
                        </>
                    ) : (
                        <>
                            {/* Not on Waitlist: Join for Discount */}
                            <motion.div variants={staggerItemVariants}>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    onClick={onJoinWaitlist}
                                    loading={isCheckingWaitlist}
                                    icon={<span>🧇</span>}
                                >
                                    Join Waffles for 50% OFF
                                </Button>
                            </motion.div>
                            <motion.p
                                className={styles.freeHint}
                                variants={staggerItemVariants}
                            >
                                Get $FOF airdrop eligibility + 50% discount
                            </motion.p>

                            {/* Divider */}
                            <motion.div
                                className={styles.divider}
                                variants={staggerItemVariants}
                            >
                                <span>— OR —</span>
                            </motion.div>

                            {/* Full Price Path */}
                            <motion.div variants={staggerItemVariants}>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    fullWidth
                                    onClick={onPaidAccess}
                                    loading={isPaying}
                                    icon={<span>💳</span>}
                                >
                                    Skip Waitlist • ${originalPrice.toFixed(2)}
                                </Button>
                            </motion.div>
                        </>
                    )}

                    <motion.p
                        className={styles.poweredBy}
                        variants={staggerItemVariants}
                    >
                        Powered by <span className="text-gold">Waffles</span> 🧇
                    </motion.p>
                </motion.div>
            </motion.div>

            {/* Floating Snowflakes with motion */}
            <div className={styles.snowflakes}>
                <motion.div
                    className={styles.snowflake1}
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Image src={ASSETS.snowflake} alt="" width={40} height={40} />
                </motion.div>
                <motion.div
                    className={styles.snowflake2}
                    animate={{
                        y: [0, 10, 0],
                        rotate: [0, -180, -360],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                    }}
                >
                    <Image src={ASSETS.snowflake} alt="" width={24} height={24} />
                </motion.div>
                <motion.div
                    className={styles.snowflake3}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 360, 720],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                >
                    <Image src={ASSETS.snowflake} alt="" width={32} height={32} />
                </motion.div>
            </div>
        </div>
    );
};
