/**
 * useCollectNFT Hook
 *
 * Handles the full NFT collection flow:
 * 1. Prepare NFT (upload to IPFS, create DB record)
 * 2. Mint NFT on-chain
 * 3. Update DB with tx hash and status
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
  const collectionIdRef = useRef<number | null>(null);

  const {
    writeContractAsync,
    data: txHash,
    reset: resetWrite,
    isPending: isWritePending,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Update status based on transaction state
  useEffect(() => {
    if (isWritePending && status === "ready") {
      setStatus("minting");
    }
    if (isConfirming && status === "minting") {
      setStatus("confirming");
    }
    if (isSuccess && (status === "confirming" || status === "minting")) {
      setStatus("success");
      // Update collection status in database
      if (collectionIdRef.current && txHash) {
        updateCollectionStatus(collectionIdRef.current, txHash, "COMPLETED");
      }
    }
  }, [isWritePending, isConfirming, isSuccess, status, txHash]);

  // Update collection status in database
  const updateCollectionStatus = async (
    collectionId: number,
    hash: string,
    newStatus: string
  ) => {
    try {
      await fetch("/api/collect", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionId,
          txHash: hash,
          status: newStatus,
        }),
      });
    } catch (err) {
      console.error("Failed to update collection status:", err);
    }
  };

  // Full collection flow: prepare + mint
  const collect = useCallback(
    async (params: CollectParams) => {
      const { imageUrl, username, fid, friendCount, generationId } = params;

      // If wallet not connected, try to connect with Farcaster connector
      if (!address || !isConnected) {
        try {
          console.log("[useCollectNFT] Wallet not connected, connecting...");
          setStatus("connecting");
          setError(null);

          // Find Farcaster connector or use first available
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
          console.log("[useCollectNFT] Connected successfully");
        } catch (err) {
          console.error("[useCollectNFT] Connection failed:", err);
          setError("Failed to connect wallet");
          setStatus("error");
          return;
        }
      }

      try {
        // Step 1: Prepare NFT (upload to IPFS, create DB record)
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
        collectionIdRef.current = data.collectionId;
        setTokenUri(uri);
        setStatus("ready");

        // Step 2: Mint NFT on-chain
        const contractAddress = getNFTContractAddress();
        if (!contractAddress) {
          throw new Error("NFT contract not configured");
        }

        // Verify we have an address after potential connection
        const userAddress = address;
        if (!userAddress) {
          throw new Error("Wallet address not available after connection");
        }

        setStatus("minting");

        await writeContractAsync({
          address: contractAddress,
          abi: MINT_ABI,
          functionName: "mint",
          args: [userAddress, uri],
          chain: getNFTChain(),
        });

        // Status will be updated by useEffect watching transaction
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Collection failed";
        setError(message);
        setStatus("error");

        // Update collection status to failed if we have an ID
        if (collectionIdRef.current) {
          updateCollectionStatus(collectionIdRef.current, "", "FAILED");
        }

        console.error("Collect error:", err);
      }
    },
    [address, isConnected, connectAsync, connectors, writeContractAsync]
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setTokenUri(null);
    collectionIdRef.current = null;
    resetWrite();
  }, [resetWrite]);

  return {
    status,
    error,
    tokenUri,
    txHash,
    collect,
    reset,
  };
}
