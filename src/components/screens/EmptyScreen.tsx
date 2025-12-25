"use client";

import { FC } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ASSETS } from "@/lib/constants";
import styles from "./EmptyScreen.module.css";

interface EmptyScreenProps {
    onGenerate: () => void;
}

export const EmptyScreen: FC<EmptyScreenProps> = ({ onGenerate }) => {
    return (
        <div className={styles.container}>
            {/* Background */}
            <div className={styles.networkBg} />

            {/* Content */}
            <div className={styles.content}>
                {/* Mascot with empty frame */}
                <div className={styles.mascotContainer}>
                    <Image
                        src={ASSETS.mascotDefault}
                        alt="FOF Mascot"
                        width={140}
                        height={140}
                        className={styles.mascot}
                        priority
                    />
                    <div className={styles.emptyFrame}>
                        <span className={styles.questionMark}>?</span>
                    </div>
                </div>

                {/* Text */}
                <div className={styles.textContainer}>
                    <h1 className={styles.title}>No FOF Yet</h1>
                    <p className={styles.message}>
                        Create your first Friends of Farcaster portrait!
                    </p>
                </div>

                {/* CTA */}
                <div className={styles.cta}>
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={onGenerate}
                        icon={<span>✨</span>}
                    >
                        Generate My FOF
                    </Button>
                </div>
            </div>

            {/* Floating Elements */}
            <div className={styles.floatingElements}>
                <Image
                    src={ASSETS.snowflake}
                    alt=""
                    width={36}
                    height={36}
                    className={styles.floatingSnowflake}
                    aria-hidden
                />
            </div>
        </div>
    );
};
