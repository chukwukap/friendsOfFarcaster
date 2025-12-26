"use client";

import { useCallback, useMemo } from "react";
import {
  useMiniKit,
  useOpenUrl,
  useComposeCast,
  useAddFrame,
  useIsInMiniApp,
  useClose,
} from "@coinbase/onchainkit/minikit";
import { APP_CONFIG } from "@/lib/constants";

interface UserData {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
}

/**
 * Custom hook for Farcaster MiniApp integration using OnchainKit MiniKit
 *
 * Provides:
 * - User context from MiniKit
 * - Share functionality via useComposeCast
 * - URL opening via useOpenUrl
 * - Add to favorites via useAddFrame
 * - Close functionality
 *
 * @see https://docs.base.org/builderkits/minikit
 */
export function useFarcaster() {
  // MiniKit hooks - note the different return types
  const { setFrameReady, context } = useMiniKit();
  const openUrl = useOpenUrl(); // Returns function directly
  const { composeCast } = useComposeCast(); // Returns object with composeCast
  const addFrame = useAddFrame(); // Returns function directly
  const { isInMiniApp } = useIsInMiniApp(); // Returns object
  const close = useClose(); // Returns function directly

  // Get user data from MiniKit context
  const user: UserData | null = useMemo(() => {
    if (!context?.user) return null;
    return {
      fid: context.user.fid,
      username: context.user.username || `fid:${context.user.fid}`,
      displayName: context.user.displayName || context.user.username || "",
      pfpUrl: context.user.pfpUrl || "/assets/default-avatar.png",
    };
  }, [context?.user]);

  // Mark frame as ready (call after initial render)
  const ready = useCallback(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Share on Farcaster using MiniKit composeCast
  // Includes both the image and share page URL for rich embeds
  const share = useCallback(
    (
      generationId: number,
      imageUrl: string,
      username?: string,
      friendCount?: number
    ) => {
      if (!composeCast) return;

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fof.app";

      // Construct share page URL with Frame embed metadata
      const sharePageUrl = `${appUrl}/share/${generationId}?${new URLSearchParams(
        {
          imageUrl,
          username: username || "anon",
          friendCount: String(friendCount || 0),
        }
      ).toString()}`;

      composeCast({
        text: APP_CONFIG.shareText,
        embeds: [imageUrl, sharePageUrl], // Image + Frame page for preview
      });
    },
    [composeCast]
  );

  // Open external URL using MiniKit
  const openExternalUrl = useCallback(
    (url: string) => {
      if (openUrl) {
        openUrl(url);
      } else {
        window.open(url, "_blank");
      }
    },
    [openUrl]
  );

  // Add app to user's favorites
  const addToFavorites = useCallback(async () => {
    if (!addFrame) return false;

    try {
      const result = await addFrame();
      return result !== null;
    } catch (error) {
      console.error("Failed to add frame:", error);
      return false;
    }
  }, [addFrame]);

  // Close the MiniApp
  const closeApp = useCallback(() => {
    if (close) {
      close();
    }
  }, [close]);

  return {
    // State
    user,
    isInMiniApp: isInMiniApp ?? false,
    context,

    // Actions
    ready,
    share,
    openUrl: openExternalUrl,
    addToFavorites,
    closeApp,
  };
}
