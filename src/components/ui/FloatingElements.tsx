"use client";

import { FC } from "react";
import Image from "next/image";
import { ASSETS } from "@/lib/constants";
import styles from "./FloatingElements.module.css";

interface FloatingElementsProps {
    variant?: "landing" | "generating" | "success";
}

export const FloatingElements: FC<FloatingElementsProps> = ({ variant = "landing" }) => {
    return (
        <div className={styles.container}>
            {/* Snowflakes */}
            <div className={`${styles.element} ${styles.snowflake1}`}>
                <Image
                    src={ASSETS.snowflake}
                    alt=""
                    width={40}
                    height={40}
                    aria-hidden
                />
            </div>
            <div className={`${styles.element} ${styles.snowflake2}`}>
                <Image
                    src={ASSETS.snowflake}
                    alt=""
                    width={28}
                    height={28}
                    aria-hidden
                />
            </div>
            <div className={`${styles.element} ${styles.snowflake3}`}>
                <Image
                    src={ASSETS.snowflake}
                    alt=""
                    width={36}
                    height={36}
                    aria-hidden
                />
            </div>

            {/* Variant-specific elements */}
            {variant === "landing" && (
                <>
                    <div className={`${styles.element} ${styles.giftBox}`}>
                        <Image
                            src={ASSETS.giftBox}
                            alt=""
                            width={60}
                            height={60}
                            aria-hidden
                        />
                    </div>
                </>
            )}

            {variant === "success" && (
                <>
                    <div className={`${styles.element} ${styles.star}`}>
                        <Image
                            src={ASSETS.star}
                            alt=""
                            width={32}
                            height={32}
                            aria-hidden
                        />
                    </div>
                    <div className={`${styles.element} ${styles.wafflesCoin}`}>
                        <Image
                            src={ASSETS.wafflesCoin}
                            alt=""
                            width={48}
                            height={48}
                            aria-hidden
                        />
                    </div>
                </>
            )}

            {variant === "generating" && (
                <div className={`${styles.element} ${styles.orbitalSnowflake}`}>
                    <Image
                        src={ASSETS.snowflake}
                        alt=""
                        width={24}
                        height={24}
                        aria-hidden
                    />
                </div>
            )}
        </div>
    );
};
