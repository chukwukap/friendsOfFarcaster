"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SafeArea } from "@coinbase/onchainkit/minikit";
import { fal } from "@fal-ai/client";
import sdk from "@farcaster/miniapp-sdk";

fal.config({
  proxyUrl: "/api/fal/proxy",
});
import {
  OnboardingScreen,
  LandingScreen,
  GeneratingScreen,
  SuccessScreen,
  ErrorScreen,
  GalleryScreen
} from "@/components/screens";
import { Confetti, Snowfall } from "@/components/ui";
import { useFarcaster, useWaitlistStatus } from "@/hooks";
import { usePayment, getPaymentButtonText } from "@/hooks/usePayment";
import { pageVariants } from "@/lib/animations";

type AppState = "onboarding" | "landing" | "generating" | "success" | "error" | "gallery";

interface GenerationResult {
  generationId: number;
  imageUrl: string;
  friendCount: number;
}

const ONBOARDING_KEY = "fof_onboarding_completed";

export function HomeClient() {
  const [appState, setAppState] = useState<AppState>("onboarding");
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

  // Waitlist status for 50% discount
  const {
    onWaitlist: isOnWaitlist,
    isLoading: isCheckingWaitlist,
    refresh: refreshWaitlist,
    discountPercent,
    originalPrice,
    discountedPrice,
  } = useWaitlistStatus({ fid: user?.fid });

  // Payment hook - pass discountedPrice to apply waitlist discount
  const payment = usePayment(discountedPrice, (txHash) => {
    // Start generation after successful payment
    if (user) {
      startGeneration(user.fid, txHash);
    } else {
      startGeneration(3, txHash); // Demo FID
    }
  });

  // Check onboarding status on mount - use localStorage (no auth required)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const onboardingComplete = localStorage.getItem(ONBOARDING_KEY);
      if (onboardingComplete) {
        setAppState("landing");
      }
    }
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_KEY, "true");
    }
    setAppState("landing");
  }, []);

  // Start image generation
  const startGeneration = async (fid: number, txHash?: string) => {
    if (isGeneratingRef.current) {
      return;
    }
    isGeneratingRef.current = true;

    setAppState("generating");
    setProgress(0);

    try {
      // 1. Prepare generation (get prompt & friends)
      // Uses Quick Auth - FID is extracted from JWT on server
      const prepareRes = await sdk.quickAuth.fetch("/api/generate/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // FID comes from auth token
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
      // Uses Quick Auth - userId is extracted from JWT on server
      const saveRes = await sdk.quickAuth.fetch("/api/generate/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
      setProgress(100);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setResult({
        generationId,
        imageUrl: generatedImageUrl,
        friendCount: friendCount,
      });

      setShowConfetti(true);

      setAppState("success");

      if (isInMiniApp) {
        addToFavorites();
      }

      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Generation failed");
      setAppState("error");
    } finally {
      isGeneratingRef.current = false;
    }
  };

  const handleShare = useCallback(async () => {
    if (!result || !user) return;
    share(result.generationId, result.imageUrl, user.username, result.friendCount);

    try {
      // Uses Quick Auth - FID is extracted from JWT on server
      await sdk.quickAuth.fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationId: result.generationId,
          platform: "FARCASTER",
        }),
      });
    } catch (err) {
      console.error("Failed to record share:", err);
    }
  }, [result, share, user]);

  const handleGenerateAnother = useCallback(() => {
    setAppState("landing");
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  const handleRetry = useCallback(() => {
    if (user) {
      startGeneration(user.fid);
    } else {
      setAppState("landing");
      setError(null);
    }
  }, [user]);

  const handleGoHome = useCallback(() => {
    setAppState("landing");
    setError(null);
  }, []);

  const handleViewGallery = useCallback(() => {
    setAppState("gallery");
  }, []);

  const handleGalleryShare = useCallback((generationId: number, imageUrl: string, friendCount: number) => {
    if (!user) return;
    share(generationId, imageUrl, user.username, friendCount);

    // Record the share
    sdk.quickAuth.fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationId,
        platform: "FARCASTER",
      }),
    }).catch(err => console.error("Failed to record share:", err));
  }, [user, share]);

  return (
    <SafeArea>
      <main className="min-h-dvh relative">
        {/* Snowfall Background */}
        <Snowfall count={25} speed="slow" />

        {/* Confetti Celebration */}
        <Confetti active={showConfetti} />

        {/* Mute Toggle */}


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
                buttonText={getPaymentButtonText(payment.step, discountedPrice)}
                error={payment.error}
                onViewGallery={handleViewGallery}
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
                onBack={handleGenerateAnother}
                onViewGallery={handleViewGallery}
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

          {appState === "gallery" && (
            <motion.div
              key="gallery"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full"
            >
              <GalleryScreen
                onBack={handleGoHome}
                onCreateNew={handleGenerateAnother}
                username={user?.username}
                onShare={handleGalleryShare}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </SafeArea>
  );
}
