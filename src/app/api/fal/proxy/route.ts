import { route } from "@fal-ai/server-proxy/nextjs";

console.log("FAL_KEY Check:", process.env.FAL_KEY ? "Loaded" : "MISSING");

export const { GET, POST } = route;
