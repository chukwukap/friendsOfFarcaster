"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { usePayment, getPaymentButtonText } from "@/hooks/usePayment";
import { useCollectNFT, useFarcaster } from "@/hooks";
import { APP_CONFIG } from "@/lib/constants";
import { WafflesFooter } from "@/components/ui/WafflesFooter";

interface CollectClientProps {
    generation: {
        id: number;
        imageUrl: string;
        friendCount: number;
        user: {
            username: string | null;
        };
    };
}

export default function CollectClient({ generation }: CollectClientProps) {
    const [hasPaid, setHasPaid] = useState(false);
    const { user } = useFarcaster();

    // Payment hook
    const payment = usePayment((txHash) => {
        console.log("Payment successful:", txHash);
        setHasPaid(true);
    });

    // NFT Collection hook
    const {
        status: collectStatus,
        error: collectError,
        txHash: collectTxHash,
        collect,
    } = useCollectNFT();

    const isCollecting = collectStatus === "preparing" || collectStatus === "minting" || collectStatus === "confirming";
    const isCollected = collectStatus === "success";

    // Auto-collect after payment
    useEffect(() => {
        if (hasPaid && !isCollected && !isCollecting) {
            collect({
                imageUrl: generation.imageUrl,
                username: generation.user.username || "collector",
                fid: user?.fid!,
                friendCount: generation.friendCount,
                generationId: generation.id,
            });
        }
    }, [hasPaid, isCollected, isCollecting, collect, generation, user]);

    const username = generation.user.username

    return (
        <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-bg-dark-start">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('/assets/bg-network-pattern.png')] bg-cover bg-center opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-dark-start/50 to-bg-dark-end/80" />
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 flex-1 flex flex-col items-center px-5 py-8 pt-[calc(env(safe-area-inset-top,16px)+24px)] pb-[calc(env(safe-area-inset-bottom,16px)+16px)] max-w-[400px] mx-auto w-full gap-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-[24px] font-bold text-white mb-1">
                        🎄 @{username}'s FOF
                    </h1>
                    <p className="text-[14px] text-text-secondary">
                        {APP_CONFIG.edition}
                    </p>
                </div>

                {/* Image */}
                <motion.div
                    className="relative rounded-2xl overflow-hidden border-[3px] border-accent-gold shadow-[0_0_60px_rgba(255,215,0,0.3)]"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Image
                        src={generation.imageUrl}
                        alt={`${username}'s FOF`}
                        width={280}
                        height={280}
                        className="w-full max-w-[280px] h-auto"
                        priority
                    />
                </motion.div>

                {/* Stats */}
                <p className="text-[14px] text-text-secondary">
                    Featuring @{username} + {generation.friendCount} friends
                </p>

                {/* Collect Status */}
                {isCollected ? (
                    <motion.div
                        className="w-full bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <p className="text-green-400 font-bold text-[16px]">
                            ✅ Successfully collected as NFT!
                        </p>
                        {collectTxHash && (
                            <a
                                href={`https://sepolia.basescan.org/tx/${collectTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[12px] text-green-300 underline mt-2 block"
                            >
                                View transaction →
                            </a>
                        )}
                    </motion.div>
                ) : (
                    <>
                        {/* Payment Button */}
                        <Button
                            variant="gold"
                            size="lg"
                            fullWidth
                            onClick={payment.pay}
                            loading={payment.isLoading || isCollecting}
                            icon={<span>✨</span>}
                        >
                            {isCollecting
                                ? "Minting NFT..."
                                : hasPaid
                                    ? "Processing..."
                                    : getPaymentButtonText(payment.step).replace("Generate", "Collect")}
                        </Button>

                        {payment.error && (
                            <p className="text-red-400 text-[12px] text-center">
                                {payment.error}
                            </p>
                        )}

                        <p className="text-[11px] text-text-secondary/70 text-center">
                            Pay ${APP_CONFIG.price.toFixed(2)} USDC to collect this FOF as an NFT
                        </p>
                    </>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer */}
                <WafflesFooter />
            </motion.div>
        </div>
    );
}
