"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ASSETS, APP_CONFIG } from "@/lib/constants";
import sdk from "@farcaster/miniapp-sdk";

interface WafflesFooterProps {
    className?: string;
}

export const WafflesFooter: FC<WafflesFooterProps> = ({ className = "" }) => {
    const handleOpenWaffles = async () => {
        try {
            // Use Farcaster SDK to open the Waffles mini app
            await sdk.actions.openUrl({ url: APP_CONFIG.wafflesMiniappUrl });
        } catch (error) {
            console.error("Failed to open Waffles:", error);
            // Fallback to regular link
            window.open(APP_CONFIG.wafflesMiniappUrl, "_blank");
        }
    };

    return (
        <motion.footer
            className={`flex items-center justify-center gap-2 text-[12px] text-text-secondary/80 py-4 ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
        >
            <span>With love from</span>
            <button
                onClick={handleOpenWaffles}
                className="flex items-center gap-1.5 text-accent-gold font-semibold hover:opacity-80 transition-opacity"
            >
                <Image
                    src={ASSETS.wafflesCoin}
                    alt="Waffles"
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                />
                <span>Waffles</span>

            </button>
        </motion.footer>
    );
};
