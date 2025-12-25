/**
 * useCollectNFT Hook
 *
 * Handles the full NFT collection flow:
 * 1. Prepare NFT (upload to IPFS)
 * 2. Mint NFT on-chain
 * 3. Record mint tx on generation
 */

import { useState, useCallback, useEffect, useRef } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useConnect,
} from "wagmi";
import { getNFTContractAddress, getNFTChain, MINT_ABI } from "@/constants/nft";

export type CollectStatus =
  | "idle"
  | "connecting"
  | "preparing"
  | "ready"
  | "minting"
  | "confirming"
  | "success"
  | "error";

export interface CollectParams {
  imageUrl: string;
  username: string;
  fid: number;
  friendCount: number;
  generationId: number;
}

interface UseCollectNFTReturn {
  status: CollectStatus;
  error: string | null;
  tokenUri: string | null;
  txHash: `0x${string}` | undefined;
  collect: (params: CollectParams) => Promise<void>;
  reset: () => void;
}

export function useCollectNFT(): UseCollectNFTReturn {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const [status, setStatus] = useState<CollectStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [tokenUri, setTokenUri] = useState<string | null>(null);

  // Track generationId for PATCH call after mint
  const generationIdRef = useRef<number | null>(null);
  const mintRecordedRef = useRef(false);

  const {
    writeContractAsync,
    data: txHash,
    reset: resetWrite,
    isPending: isWritePending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Update status and record mint after confirmation
  useEffect(() => {
    if (isWritePending && status === "ready") {
      setStatus("minting");
    }
    if (isConfirming && status === "minting") {
      setStatus("confirming");
    }
    if (
      isSuccess &&
      (status === "confirming" || status === "minting") &&
      !mintRecordedRef.current
    ) {
      setStatus("success");
      mintRecordedRef.current = true;

      // Record mint tx on generation
      if (generationIdRef.current && txHash) {
        fetch("/api/collect", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            generationId: generationIdRef.current,
            txHash,
          }),
        }).catch((err) => console.error("Failed to record mint:", err));
      }
    }
  }, [isWritePending, isConfirming, isSuccess, status, txHash]);

  const collect = useCallback(
    async (params: CollectParams) => {
      const { imageUrl, username, fid, friendCount, generationId } = params;

      // Store generationId for later
      generationIdRef.current = generationId;
      mintRecordedRef.current = false;

      // Connect wallet if needed
      if (!address || !isConnected) {
        try {
          setStatus("connecting");
          setError(null);

          const farcasterConnector =
            connectors.find(
              (c) =>
                c.id === "farcasterFrame" ||
                c.name.toLowerCase().includes("farcaster")
            ) || connectors[0];

          if (!farcasterConnector) {
            setError("No wallet connector available");
            setStatus("error");
            return;
          }

          await connectAsync({ connector: farcasterConnector });
        } catch (err) {
          console.error("[useCollectNFT] Connection failed:", err);
          setError("Failed to connect wallet");
          setStatus("error");
          return;
        }
      }

      try {
        // Step 1: Prepare NFT (upload to IPFS)
        setStatus("preparing");
        setError(null);

        const response = await fetch("/api/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl,
            username,
            fid,
            friendCount,
            generationId,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to prepare NFT");
        }

        const data = await response.json();
        const uri = data.tokenUri;
        setTokenUri(uri);
        setStatus("ready");

        // Step 2: Mint NFT on-chain
        const contractAddress = getNFTContractAddress();
        if (!contractAddress) throw new Error("NFT contract not configured");
        if (!address) throw new Error("Wallet address not available");

        setStatus("minting");

        await writeContractAsync({
          address: contractAddress,
          abi: MINT_ABI,
          functionName: "mint",
          args: [address, uri],
          chain: getNFTChain(),
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Collection failed";
        setError(message);
        setStatus("error");
        console.error("Collect error:", err);
      }
    },
    [address, isConnected, connectAsync, connectors, writeContractAsync]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setTokenUri(null);
    generationIdRef.current = null;
    mintRecordedRef.current = false;
    resetWrite();
  }, [resetWrite]);

  return { status, error, tokenUri, txHash, collect, reset };
}
