"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { fal } from "@fal-ai/client";

fal.config({
  proxyUrl: "/api/fal/proxy",
});
import {
  OnboardingScreen,
  LandingScreen,
  GeneratingScreen,
  SuccessScreen,
  ErrorScreen
} from "@/components/screens";
import { Confetti, Snowfall } from "@/components/ui";
import { useSound, useFarcaster, useCollectNFT, useWaitlistStatus } from "@/hooks";
import { usePayment, getPaymentButtonText } from "@/hooks/usePayment";
import { APP_CONFIG } from "@/lib/constants";
import { getWafflesWaitlistUrl } from "@/lib/waffles";
import { pageVariants, springTransition } from "@/lib/animations";

type AppState = "onboarding" | "landing" | "generating" | "success" | "error";

interface GenerationResult {
  generationId: number;
  imageUrl: string;
  friendCount: number;
}

const ONBOARDING_KEY = "fof_onboarding_complete";

export function HomeClient() {
  const [appState, setAppState] = useState<AppState>("onboarding");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Guard against duplicate generation calls
  const isGeneratingRef = useRef(false);

  // MiniKit hooks via useFarcaster
  const {
    user,
    isInMiniApp,
    share,
    openUrl,
    addToFavorites,
  } = useFarcaster();

  const { sounds, toggleMute, isMuted } = useSound();

  // NFT Collection hook
  const {
    status: collectStatus,
    error: collectError,
    txHash,
    collect,
    reset: resetCollect,
  } = useCollectNFT();

  // Derive isCollecting from collect status
  const isCollecting = collectStatus === "preparing" || collectStatus === "minting" || collectStatus === "confirming";

  // Waitlist status for 50% discount
  const {
    onWaitlist: isOnWaitlist,
    isLoading: isCheckingWaitlist,
    refresh: refreshWaitlist,
    discountPercent,
    originalPrice,
    discountedPrice,
  } = useWaitlistStatus({ fid: user?.fid });

  // Payment hook
  const payment = usePayment((txHash) => {
    console.log("Payment successful, txHash:", txHash);
    // Start generation after successful payment
    if (user) {
      startGeneration(user.fid, txHash);
    } else {
      startGeneration(3, txHash); // Demo FID
    }
  });

  // Check onboarding status on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const onboardingComplete = localStorage.getItem(ONBOARDING_KEY);
      if (onboardingComplete) {
        setAppState("landing");
      }
    }
  }, []);

  // Handle onboarding complete
  const handleOnboardingComplete = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "true");
    }
    sounds.buttonTap();
    setAppState("landing");
  }, [sounds]);

  // Handle joining Waffles waitlist
  const handleJoinWaitlist = useCallback(() => {
    sounds.buttonTap();
    openUrl(getWafflesWaitlistUrl());
  }, [sounds, openUrl]);

  // Handle FREE access path
  const handleFreeAccess = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    sounds.buttonTap();

    try {
      openUrl(getWafflesWaitlistUrl());
      if (user) {
        await startGeneration(user.fid);
      } else {
        const demoFid = 3;
        await startGeneration(demoFid);
      }
    } catch (err) {
      console.error("Free access error:", err);
      setError("Failed to connect. Please try again.");
      sounds.gentleError();
      setIsConnecting(false);
    }
  }, [user, sounds, openUrl]);

  // Handle PAID access path
  const handlePaidAccess = useCallback(async () => {
    setIsPaying(true);
    setError(null);
    sounds.buttonTap();

    try {
      if (user) {
        await startGeneration(user.fid);
      } else {
        const demoFid = 3;
        await startGeneration(demoFid);
      }
    } catch (err) {
      console.error("Paid access error:", err);
      setError("Payment failed. Please try again.");
      sounds.gentleError();
      setIsPaying(false);
    }
  }, [user, sounds]);

  // Start image generation
  const startGeneration = async (fid: number, txHash?: string) => {
    if (isGeneratingRef.current) {
      console.log("Generation already in progress, skipping...");
      return;
    }
    isGeneratingRef.current = true;

    setAppState("generating");
    setProgress(0);
    setIsConnecting(false);
    setIsPaying(false);
    sounds.progressStart();

    try {
      // 1. Prepare generation (get prompt & friends)
      const prepareRes = await fetch("/api/generate/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid }),
      });

      if (!prepareRes.ok) {
        throw new Error("Failed to prepare generation");
      }

      const prepareData = await prepareRes.json();
      const { prompt, imageUrls, userId, friendCount, friendFids } = prepareData;

      // 2. Client-side Generation with Fal.ai
      // Note: We use the fal proxy automatically because we configured it in next.config or via fal.config
      // But we need to configure it here if it's not global.
      // Actually @fal-ai/client defaults to /api/fal/proxy if found.
      const result: any = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
        input: {
          prompt,
          image_urls: imageUrls,
          num_images: 1,
          aspect_ratio: "1:1",
          output_format: "png",
        },
        logs: true,
        onQueueUpdate: (update: any) => {
          if (update.status === "IN_PROGRESS") {
            setProgress((p) => Math.min(p + 1, 90));
            if (update.logs && update.logs.length > 0) {
              const lastLog = update.logs[update.logs.length - 1];
              console.log("[Fal] " + lastLog.message);
            }
          }
        },
      });

      // Handle response structure (some versions return { data: ... }, others just data)
      const data = result.data || result;
      const generatedImageUrl = data.images?.[0]?.url || data.image?.url;

      if (!generatedImageUrl) {
        throw new Error("No image returned from generation");
      }

      // 3. Save result
      const saveRes = await fetch("/api/generate/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          imageUrl: generatedImageUrl,
          prompt,
          friendCount,
          friendFids,
          paymentTxHash: txHash,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save generation result");
      }

      const saveData = await saveRes.json();
      const generationId = saveData.generationId;

      sounds.almostDone();
      setProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setResult({
        generationId,
        imageUrl: generatedImageUrl,
        friendCount: friendCount,
      });

      sounds.successReveal();
      setShowConfetti(true);
      sounds.confettiBurst();
      sounds.pointsEarned();

      setAppState("success");

      if (isInMiniApp) {
        addToFavorites();
      }

      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Generation failed");
      sounds.gentleError();
      setAppState("error");
    } finally {
      isGeneratingRef.current = false;
    }
  };

  // Handle share
  const handleShare = useCallback(async () => {
    if (!result || !user) return;
    sounds.buttonTap();
    share(result.generationId, result.imageUrl, user.username, result.friendCount);
    sounds.shareComplete();

    try {
      await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: user.fid,
          generationId: result.generationId,
          platform: "FARCASTER",
        }),
      });
    } catch (err) {
      console.error("Failed to record share:", err);
    }
  }, [result, sounds, share, user]);

  // Handle collect
  const handleCollect = useCallback(async () => {
    if (!result || !user) return;
    sounds.buttonTap();

    await collect({
      imageUrl: result.imageUrl,
      username: user.username || "anon",
      fid: user.fid,
      friendCount: result.friendCount,
      generationId: result.generationId,
    });
  }, [result, user, sounds, collect]);

  // Handle collect status changes
  useEffect(() => {
    if (collectStatus === "success") {
      sounds.pointsBonus();
      console.log(`Collected FOF as NFT! +${APP_CONFIG.pointsForCollect} points. Tx: ${txHash}`);
    } else if (collectStatus === "error" && collectError) {
      sounds.gentleError();
      console.error("Collect error:", collectError);
    }
  }, [collectStatus, collectError, txHash, sounds]);

  // Handle download
  const handleDownload = useCallback(async () => {
    if (!result || !user) return;
    sounds.buttonTap();

    const link = document.createElement("a");
    link.href = result.imageUrl;
    link.download = `fof-${user.username || "portrait"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    try {
      await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid: user.fid,
          generationId: result.generationId,
          platform: "DOWNLOAD",
        }),
      });
    } catch (err) {
      console.error("Failed to record download:", err);
    }
  }, [result, user, sounds]);

  // Handle generate another
  const handleGenerateAnother = useCallback(() => {
    sounds.buttonTap();
    setAppState("landing");
    setProgress(0);
    setResult(null);
    setError(null);
  }, [sounds]);

  // Handle retry from error
  const handleRetry = useCallback(() => {
    sounds.buttonTap();
    if (user) {
      startGeneration(user.fid);
    } else {
      setAppState("landing");
      setError(null);
    }
  }, [user, sounds]);

  // Handle go home from error
  const handleGoHome = useCallback(() => {
    sounds.buttonTap();
    setAppState("landing");
    setError(null);
  }, [sounds]);

  return (
    <SafeArea>
      <main className="min-h-screen min-h-[100dvh] relative">
        {/* Snowfall Background */}
        <Snowfall count={25} speed="slow" />

        {/* Confetti Celebration */}
        <Confetti active={showConfetti} />

        {/* Mute Toggle */}
        <motion.button
          className="fixed top-lg right-lg z-100 bg-surface-glass backdrop-blur-[10px] border border-surface-glass-border rounded-full w-[44px] h-[44px] flex items-center justify-center text-[20px] cursor-pointer hover:scale-[1.05] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] active:scale-[0.95] transition-transform duration-200"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springTransition}
        >
          {isMuted ? "🔇" : "🔊"}
        </motion.button>

        {/* Animated Screen Transitions */}
        <AnimatePresence mode="wait">
          {appState === "onboarding" && (
            <motion.div
              key="onboarding"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <OnboardingScreen onComplete={handleOnboardingComplete} />
            </motion.div>
          )}

          {appState === "landing" && (
            <motion.div
              key="landing"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <LandingScreen
                onGenerate={payment.pay}
                isLoading={payment.isLoading}
                buttonText={getPaymentButtonText(payment.step)}
                error={payment.error}
              />
            </motion.div>
          )}

          {appState === "generating" && (
            <motion.div
              key="generating"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <GeneratingScreen
                username={user?.username || "you"}
                friendCount={result?.friendCount || 0}
                progress={progress}
              />
            </motion.div>
          )}

          {appState === "success" && result && (
            <motion.div
              key="success"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <SuccessScreen
                imageUrl={result.imageUrl}
                username={user?.username || "anon"}
                displayName={user?.displayName || "Anonymous"}
                friendCount={result.friendCount}
                onShare={handleShare}
                onCollect={handleCollect}
                onBack={handleGenerateAnother}
                isCollecting={isCollecting}
              />
            </motion.div>
          )}

          {appState === "error" && (
            <motion.div
              key="error"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <ErrorScreen
                message={error || "Something went wrong"}
                onRetry={handleRetry}
                onGoHome={handleGoHome}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </SafeArea>
  );
}
