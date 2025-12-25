"use client";

import { ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "viem/chains";
import { minikitConfig } from "../../minikit.config";

interface ProvidersProps {
    children: ReactNode;
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
                    name: "FOF: Friends of Farcaster",
                    logo: "/assets/fof-logo.png",
                    mode: "dark",
                    theme: "default",
                },
                wallet: {
                    display: "modal",
                    preference: "all",
                },
            }}
            miniKit={{
                enabled: true,
                autoConnect: true,
                notificationProxyUrl: minikitConfig.miniapp?.webhookUrl || "/api/webhook/farcaster",
            }}
        >
            {children}
        </OnchainKitProvider>
    );
}
