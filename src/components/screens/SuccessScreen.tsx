"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PointsBadge } from "@/components/ui/PointsBadge";
import { ASSETS, APP_CONFIG } from "@/lib/constants";
import {
    staggerContainerVariants,
    staggerItemVariants,
    imageRevealVariants,
    imageFrameVariants,
    springTransition,
} from "@/lib/animations";
import styles from "./SuccessScreen.module.css";

interface SuccessScreenProps {
    imageUrl: string;
    username: string;
    displayName: string;
    friendCount: number;
    onShare: () => void;
    onCollect: () => void;
    onDownload: () => void;
    onGenerateAnother: () => void;
    isCollecting?: boolean;
}

export const SuccessScreen: FC<SuccessScreenProps> = ({
    imageUrl,
    username,
    displayName,
    friendCount,
    onShare,
    onCollect,
    onDownload,
    onGenerateAnother,
    isCollecting = false,
}) => {
    return (
        <div className={styles.container}>
            {/* Celebration Background */}
            <motion.div
                className={styles.celebrationBg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            />

            {/* Content with stagger animation */}
            <motion.div
                className={styles.content}
                variants={staggerContainerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Header with bounce */}
                <motion.div
                    className={styles.header}
                    variants={staggerItemVariants}
                >
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 15,
                        }}
                    >
                        🎉 Your FOF is Ready!
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Here&apos;s your FOF: {APP_CONFIG.edition}
                    </motion.p>
                </motion.div>

                {/* Generated Image with reveal animation */}
                <motion.div
                    className={styles.imageFrame}
                    variants={imageFrameVariants}
                    initial="initial"
                    animate="celebration"
                >
                    <motion.div
                        variants={imageRevealVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <Image
                            src={imageUrl}
                            alt={`${displayName}'s FOF`}
                            width={300}
                            height={300}
                            className={styles.generatedImage}
                            priority
                        />
                    </motion.div>
                    <motion.span
                        className={styles.badge}
                        initial={{ opacity: 0, scale: 0, rotate: -20 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: 0.6, ...springTransition }}
                    >
                        {APP_CONFIG.edition}
                    </motion.span>
                </motion.div>

                {/* User Info with slide-in */}
                <motion.div
                    className={styles.userInfo}
                    variants={staggerItemVariants}
                >
                    <motion.span
                        className={styles.username}
                        whileHover={{ scale: 1.05 }}
                    >
                        @{username}
                    </motion.span>
                    <motion.span className={styles.friendCount}>
                        + {friendCount} friends
                    </motion.span>
                </motion.div>

                {/* Points Reward with pop animation */}
                <motion.div
                    className={styles.pointsReward}
                    variants={staggerItemVariants}
                >
                    <motion.span
                        className={styles.rewardText}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        ✨ We rewarded you with
                    </motion.span>
                    <PointsBadge points={APP_CONFIG.pointsForGeneration} size="lg" />
                    <motion.span
                        className={styles.rewardSubtext}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                    >
                        For the Waffles leaderboard
                    </motion.span>
                </motion.div>

                {/* CTAs with stagger */}
                <motion.div
                    className={styles.ctas}
                    variants={staggerContainerVariants}
                >
                    {/* Primary: Share */}
                    <motion.div variants={staggerItemVariants}>
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={onShare}
                            icon={<span>🔮</span>}
                        >
                            Share on Farcaster
                        </Button>
                    </motion.div>

                    {/* Secondary: Collect as NFT */}
                    <motion.div variants={staggerItemVariants}>
                        <Button
                            variant="gold"
                            fullWidth
                            onClick={onCollect}
                            loading={isCollecting}
                            icon={<span>✨</span>}
                        >
                            Collect FOF (+{APP_CONFIG.pointsForCollect} pts)
                        </Button>
                    </motion.div>

                    {/* Tertiary buttons */}
                    <motion.div
                        className={styles.tertiaryButtons}
                        variants={staggerItemVariants}
                    >
                        <Button variant="ghost" onClick={onDownload}>
                            Download
                        </Button>
                        <Button variant="ghost" onClick={onGenerateAnother}>
                            New FOF
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Powered By */}
                <motion.p
                    className={styles.poweredBy}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    Powered by <span className="text-gold">Waffles</span> 🧇
                </motion.p>
            </motion.div>

            {/* Floating Elements with continuous animation */}
            <div className={styles.floatingElements}>
                <motion.div
                    className={styles.floatingSnowflake1}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Image src={ASSETS.snowflake} alt="" width={32} height={32} />
                </motion.div>
                <motion.div
                    className={styles.floatingStar}
                    animate={{
                        y: [0, 15, 0],
                        rotate: [0, -360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                    }}
                >
                    <Image src={ASSETS.star} alt="" width={28} height={28} />
                </motion.div>
            </div>
        </div>
    );
};
