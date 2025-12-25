/**
 * useWaitlistStatus Hook
 *
 * Checks if the current user is on the Waffles waitlist.
 * Returns waitlist status and discount eligibility.
 */

import { useState, useEffect, useCallback } from "react";
import { verifyWaitlist, WaitlistStatus } from "@/lib/waffles";

interface UseWaitlistStatusOptions {
  fid: number | undefined;
}

interface UseWaitlistStatusReturn extends WaitlistStatus {
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  // Pricing
  discountPercent: number;
  originalPrice: number;
  discountedPrice: number;
}

const ORIGINAL_PRICE = 1.0; // $1.00
const DISCOUNT_PERCENT = 50; // 50% off

export function useWaitlistStatus(
  options: UseWaitlistStatusOptions
): UseWaitlistStatusReturn {
  const { fid } = options;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<WaitlistStatus>({
    onWaitlist: false,
    points: 0,
  });

  const fetchStatus = useCallback(async () => {
    if (!fid) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await verifyWaitlist(fid);
      setStatus(result);
    } catch (err) {
      console.error("Error checking waitlist status:", err);
      setError(err instanceof Error ? err.message : "Failed to check waitlist");
      setStatus({ onWaitlist: false, points: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [fid]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Calculate pricing
  const discountedPrice = status.onWaitlist
    ? ORIGINAL_PRICE * (1 - DISCOUNT_PERCENT / 100)
    : ORIGINAL_PRICE;

  return {
    ...status,
    isLoading,
    error,
    refresh: fetchStatus,
    discountPercent: status.onWaitlist ? DISCOUNT_PERCENT : 0,
    originalPrice: ORIGINAL_PRICE,
    discountedPrice,
  };
}
