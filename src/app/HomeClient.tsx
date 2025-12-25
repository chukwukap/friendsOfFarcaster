"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import {
  OnboardingScreen,
  LandingScreen,
  GeneratingScreen,
  SuccessScreen,
  ErrorScreen
} from "@/components/screens";
import { Confetti, Snowfall } from "@/components/ui";
import { useSound, useFarcaster, useCollectNFT, useWaitlistStatus } from "@/hooks";
import { APP_CONFIG } from "@/lib/constants";
import { getWafflesWaitlistUrl } from "@/lib/waffles";
import { pageVariants, springTransition } from "@/lib/animations";
import styles from "./page.module.css";

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

  // MiniKit hooks via useFarcaster
  const {
    user,
    isInMiniApp,
    ready,
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

  // Check onboarding status on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const onboardingComplete = localStorage.getItem(ONBOARDING_KEY);
      if (onboardingComplete) {
        setAppState("landing");
      }
    }
  }, []);

  // Initialize MiniKit - mark frame as ready
  useEffect(() => {
    ready();
  }, [ready]);

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
    // After they join, they'll need to refresh to see their discount
    // We could add a polling mechanism or prompt to refresh
  }, [sounds, openUrl]);

  // Handle FREE access path - Opens Waffles waitlist
  const handleFreeAccess = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    sounds.buttonTap();

    try {
      // Open Waffles waitlist using MiniKit
      openUrl(getWafflesWaitlistUrl());

      // Get user from MiniKit context
      if (user) {
        await startGeneration(user.fid);
      } else {
        // Demo mode for testing outside MiniApp
        console.log("No user context - using demo mode");
        const demoFid = 3; // dwr.eth
        await startGeneration(demoFid);
      }
    } catch (err) {
      console.error("Free access error:", err);
      setError("Failed to connect. Please try again.");
      sounds.gentleError();
      setIsConnecting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, sounds, openUrl]);

  // Handle PAID access path - $1 payment
  const handlePaidAccess = useCallback(async () => {
    setIsPaying(true);
    setError(null);
    sounds.buttonTap();

    try {
      // TODO: Integrate wallet payment via MiniKit useSendToken

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, sounds]);

  // Start image generation
  const startGeneration = async (fid: number) => {
    setAppState("generating");
    setProgress(0);
    setIsConnecting(false);
    setIsPaying(false);
    sounds.progressStart();

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const newProgress = prev + Math.random() * 15;
        if (Math.floor(newProgress / 25) > Math.floor(prev / 25)) {
          sounds.progressTick();
        }
        return newProgress;
      });
    }, 1000);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Generation failed");
      }

      const data = await response.json();

      sounds.almostDone();
      setProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setResult({
        generationId: data.generationId,
        imageUrl: data.imageUrl,
        friendCount: data.friendCount,
      });

      // Celebration!
      sounds.successReveal();
      setShowConfetti(true);
      sounds.confettiBurst();
      sounds.pointsEarned();

      setAppState("success");

      // Prompt user to add app to favorites
      if (isInMiniApp) {
        addToFavorites();
      }

      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Generation failed");
      sounds.gentleError();
      setAppState("error");
    }
  };

  // Handle share on Farcaster using MiniKit
  const handleShare = useCallback(async () => {
    if (!result || !user) return;
    sounds.buttonTap();

    // Use MiniKit composeCast with share page URL containing Frame metadata
    share(result.imageUrl, user.username, result.friendCount);
    sounds.shareComplete();

    // Record share in database
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

  // Handle collect as NFT (+50 points)
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

    // Record download as a share in database
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, sounds]);

  // Handle go home from error
  const handleGoHome = useCallback(() => {
    sounds.buttonTap();
    setAppState("landing");
    setError(null);
  }, [sounds]);

  return (
    <SafeArea>
      <main className={styles.main}>
        {/* Snowfall Background */}
        <Snowfall count={25} speed="slow" />

        {/* Confetti Celebration */}
        <Confetti active={showConfetti} />

        {/* Mute Toggle */}
        <motion.button
          className={styles.muteToggle}
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
              className={styles.screenWrapper}
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
              className={styles.screenWrapper}
            >
              <LandingScreen
                onFreeAccess={handleFreeAccess}
                onPaidAccess={handlePaidAccess}
                onJoinWaitlist={handleJoinWaitlist}
                isConnecting={isConnecting}
                isPaying={isPaying}
                isOnWaitlist={isOnWaitlist}
                isCheckingWaitlist={isCheckingWaitlist}
                discountPercent={discountPercent}
                originalPrice={originalPrice}
                discountedPrice={discountedPrice}
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
              className={styles.screenWrapper}
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
              className={styles.screenWrapper}
            >
              <SuccessScreen
                imageUrl={result.imageUrl}
                username={user?.username || "anon"}
                displayName={user?.displayName || "Anonymous"}
                friendCount={result.friendCount}
                onShare={handleShare}
                onCollect={handleCollect}
                onDownload={handleDownload}
                onGenerateAnother={handleGenerateAnother}
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
              className={styles.screenWrapper}
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
