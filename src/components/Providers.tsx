"use client";

import { ReactNode, useEffect } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { base } from "viem/chains";
import { minikitConfig } from "../../minikit.config";

interface ProvidersProps {
    children: ReactNode;
}

/**
 * Initializes Farcaster SDK by calling setFrameReady() once at app mount.
 * This signals to the Farcaster client that the app is ready.
 */
function FarcasterInitializer({ children }: { children: ReactNode }) {
    const { setMiniAppReady, isMiniAppReady } = useMiniKit();
    useEffect(() => {
        if (!isMiniAppReady) {
            setMiniAppReady();
        }
    }, [setMiniAppReady, isMiniAppReady]);


    return <>{children}</>;
}

/**
 * OnchainKit Provider wrapping the application
 * 
 * Provides:
 * - WagmiProvider for wallet connections (built-in)
 * - QueryClientProvider for react-query (built-in)
 * - MiniKit context for Farcaster MiniApp features
 * 
 * @see https://docs.base.org/builderkits/minikit/getting-started
 */
export function Providers({ children }: ProvidersProps) {
    return (
        <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
            chain={base}
            config={{
                appearance: {
                    name: "FOF: Friends on Farcaster",
                    logo: "/assets/logo.png",
                    mode: "dark",
                    theme: "default",
                },
                wallet: {
                    display: "modal",
                    preference: "all",
                    supportedWallets: {
                        frame: true,
                    }
                },
            }}
            miniKit={{
                enabled: true,
                autoConnect: true,
                notificationProxyUrl: minikitConfig.miniapp?.webhookUrl || "/api/webhook/farcaster",
            }}
        >
            <FarcasterInitializer>{children}</FarcasterInitializer>
        </OnchainKitProvider>
    );
}

