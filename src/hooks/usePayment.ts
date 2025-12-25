"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  useAccount,
  useConnect,
  useSendCalls,
  useCallsStatus,
  useChainId,
  useSwitchChain,
  useReadContract,
} from "wagmi";
import { parseUnits, encodeFunctionData, erc20Abi } from "viem";

import {
  TOKEN_CONFIG,
  TREASURY_CONFIG,
  CHAIN_CONFIG,
  GENERATION_PRICE,
} from "@/lib/contracts/config";

// ==========================================
// TYPES
// ==========================================

export type PaymentStep =
  | "idle"
  | "connecting"
  | "switching-chain"
  | "pending" // User signing
  | "confirming" // Waiting for on-chain confirmation
  | "success"
  | "error";

export interface PaymentState {
  step: PaymentStep;
  error?: string;
  txHash?: string;
}

// ==========================================
// HOOK: usePayment
// Uses EIP-5792 useSendCalls for USDC transfer
// ==========================================

export function usePayment(onSuccess?: (txHash: string) => void) {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const currentChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const [state, setState] = useState<PaymentState>({ step: "idle" });

  // Ref to track latest onSuccess callback (avoids stale closure in effect)
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  // Ref to track if success callback has been called for current transaction
  const successHandledRef = useRef(false);

  // Price in token units (1 USDC = 1,000,000 units)
  const priceInUnits = useMemo(
    () => parseUnits(GENERATION_PRICE.toString(), TOKEN_CONFIG.decimals),
    []
  );

  // Check if on correct chain
  const isCorrectChain = currentChainId === CHAIN_CONFIG.chainId;

  // Read USDC balance
  const { data: balance } = useReadContract({
    address: TOKEN_CONFIG.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  // Check if user has sufficient balance
  const hasSufficientBalance = useMemo(() => {
    if (!balance) return false;
    return balance >= priceInUnits;
  }, [balance, priceInUnits]);

  // ==========================================
  // BUILD TRANSFER CALL
  // ==========================================
  const transferCall = useMemo(() => {
    if (!address) return null;

    return {
      to: TOKEN_CONFIG.address as `0x${string}`,
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "transfer",
        args: [TREASURY_CONFIG.address, priceInUnits],
      }),
    };
  }, [address, priceInUnits]);

  // ==========================================
  // useSendCalls for transaction
  // ==========================================
  const {
    sendCalls,
    data: callsId,
    isPending: isSending,
    error: sendError,
    reset: resetSendCalls,
  } = useSendCalls();

  // Track transaction status
  const { data: callsStatus } = useCallsStatus({
    id: callsId?.id ?? "",
    query: {
      enabled: !!callsId?.id,
      refetchInterval: (data) => {
        if (data.state.data?.status === "success") return false;
        return 1000; // Poll every second
      },
    },
  });

  // ==========================================
  // EFFECTS: Handle status changes
  // ==========================================

  // Update state based on send status
  useEffect(() => {
    if (isSending && state.step !== "pending") {
      console.log("[usePayment] Transaction pending...");
      setState({ step: "pending" });
    }
  }, [isSending, state.step]);

  // Handle send errors
  useEffect(() => {
    if (sendError) {
      console.error("[usePayment] Send error:", sendError);
      const errorMessage = sendError.message.includes("rejected")
        ? "Transaction rejected"
        : sendError.message.includes("insufficient")
        ? "Insufficient USDC balance"
        : "Transaction failed";
      setState({ step: "error", error: errorMessage });
    }
  }, [sendError]);

  // Handle calls confirmation
  useEffect(() => {
    if (!callsStatus) return;

    console.log("[usePayment] Calls status:", callsStatus.status);

    if (callsStatus.status === "pending" && state.step === "pending") {
      setState({ step: "confirming" });
    }

    if (callsStatus.status === "failure") {
      console.error("[usePayment] Transaction failed:", callsStatus);
      setState({ step: "error", error: "Transaction failed on-chain" });
    }

    if (callsStatus.status === "success" && !successHandledRef.current) {
      const txHash = callsStatus.receipts?.[0]?.transactionHash;
      console.log("[usePayment] Confirmed! TX:", txHash);
      setState({ step: "success", txHash });

      // Mark as handled to prevent duplicate calls
      successHandledRef.current = true;

      if (txHash) {
        onSuccessRef.current?.(txHash);
      }
    }
  }, [callsStatus, state.step]);

  // ==========================================
  // PAY FUNCTION
  // ==========================================
  const pay = useCallback(async () => {
    // If wallet not connected, try to connect with Farcaster connector
    if (!address || !isConnected) {
      try {
        console.log("[usePayment] Wallet not connected, connecting...");
        setState({ step: "connecting" });

        // Find Farcaster connector or use first available
        const farcasterConnector =
          connectors.find(
            (c) =>
              c.id === "farcasterFrame" ||
              c.name.toLowerCase().includes("farcaster")
          ) || connectors[0];

        if (!farcasterConnector) {
          setState({ step: "error", error: "No wallet connector available" });
          return;
        }

        await connectAsync({ connector: farcasterConnector });
        console.log("[usePayment] Connected successfully");
      } catch (error) {
        console.error("[usePayment] Connection failed:", error);
        setState({ step: "error", error: "Failed to connect wallet" });
        return;
      }
    }

    if (!transferCall) {
      setState({ step: "error", error: "Transaction not ready" });
      return;
    }

    console.log("[usePayment] Starting payment...", {
      price: GENERATION_PRICE,
      priceInUnits: priceInUnits.toString(),
      treasury: TREASURY_CONFIG.address,
    });

    // Check chain
    if (!isCorrectChain) {
      try {
        console.log("[usePayment] Switching to correct chain...");
        setState({ step: "switching-chain" });
        await switchChainAsync({ chainId: CHAIN_CONFIG.chainId });
      } catch (error) {
        console.error("[usePayment] Chain switch failed:", error);
        setState({ step: "error", error: "Failed to switch network" });
        return;
      }
    }

    // Reset previous state
    resetSendCalls();
    setState({ step: "pending" });
    successHandledRef.current = false;

    // Send transfer
    try {
      console.log("[usePayment] Sending USDC transfer...");
      sendCalls({
        calls: [transferCall],
      });
    } catch (error: any) {
      console.error("[usePayment] Send calls error:", error);
      setState({ step: "error", error: "Failed to send transaction" });
    }
  }, [
    address,
    isConnected,
    connectAsync,
    connectors,
    transferCall,
    isCorrectChain,
    priceInUnits,
    switchChainAsync,
    resetSendCalls,
    sendCalls,
  ]);

  // ==========================================
  // RESET FUNCTION
  // ==========================================
  const reset = useCallback(() => {
    resetSendCalls();
    setState({ step: "idle" });
    successHandledRef.current = false;
  }, [resetSendCalls]);

  // ==========================================
  // RETURN
  // ==========================================
  return {
    // State
    state,
    step: state.step,
    error: state.error,
    txHash: state.txHash,

    // Derived state
    isIdle: state.step === "idle",
    isPending: state.step === "pending",
    isConfirming: state.step === "confirming",
    isSuccess: state.step === "success",
    isError: state.step === "error",
    isLoading: [
      "connecting",
      "switching-chain",
      "pending",
      "confirming",
    ].includes(state.step),

    // Data
    balance,
    hasSufficientBalance,
    price: GENERATION_PRICE,

    // Actions
    pay,
    reset,
  };
}

// ==========================================
// HELPER: Get button text based on step
// ==========================================
export function getPaymentButtonText(step: PaymentStep): string {
  switch (step) {
    case "idle":
      return `Generate for $${GENERATION_PRICE.toFixed(2)}`;
    case "connecting":
      return "Connecting wallet...";
    case "switching-chain":
      return "Switching network...";
    case "pending":
      return "Confirm in wallet...";
    case "confirming":
      return "Processing...";
    case "success":
      return "Payment successful!";
    case "error":
      return "Try again";
    default:
      return `Generate for $${GENERATION_PRICE.toFixed(2)}`;
  }
}
