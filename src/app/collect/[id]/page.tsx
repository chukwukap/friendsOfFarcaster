import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { notFound } from "next/navigation";
import CollectClient from "./client";

interface CollectPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({
    params,
}: CollectPageProps): Promise<Metadata> {
    const { id } = await params;
    const generationId = parseInt(id, 10);

    if (isNaN(generationId)) {
        return { title: "FOF Collect" };
    }

    const generation = await prisma.generation.findUnique({
        where: { id: generationId },
        include: { user: true },
    });

    if (!generation) {
        return { title: "FOF Not Found" };
    }

    const username = generation.user.username || "friend";
    const ogParams = new URLSearchParams();
    ogParams.set("imageUrl", generation.imageUrl);
    ogParams.set("username", username);
    ogParams.set("friendCount", generation.friendCount.toString());
    const ogImageUrl = `${env.rootUrl}/api/og?${ogParams.toString()}`;

    return {
        title: `Collect @${username}'s FOF`,
        description: `Collect this FOF portrait as an NFT!`,
        openGraph: {
            title: `Collect @${username}'s FOF`,
            images: [ogImageUrl],
        },
        other: {
            "fc:frame": JSON.stringify({
                version: "1",
                imageUrl: ogImageUrl,
                button: {
                    title: "🎄 Collect This FOF",
                    action: {
                        type: "launch_frame",
                        name: "Collect FOF",
                        url: `${env.rootUrl}/collect/${generationId}`,
                        splashImageUrl: `${env.rootUrl}/assets/splash.png`,
                        splashBackgroundColor: "#0A0A0F",
                    },
                },
            }),
        },
    };
}

export default async function CollectPage({ params }: CollectPageProps) {
    const { id } = await params;
    const generationId = parseInt(id, 10);

    if (isNaN(generationId)) {
        notFound();
    }

    const generation = await prisma.generation.findUnique({
        where: { id: generationId },
        include: { user: true },
    });

    if (!generation) {
        notFound();
    }

    return (
        <CollectClient
            generation={{
                id: generation.id,
                imageUrl: generation.imageUrl,
                friendCount: generation.friendCount,
                user: {
                    username: generation.user.username,
                },
            }}
        />
    );
}
