import { FriendData, UserWithFriends } from "./neynar";

/**
 * Build the prompt for FOF image generation
 * Only dynamic value is the person count (capped at 9)
 */
export function buildFOFPrompt(
  user: UserWithFriends["user"],
  friends: FriendData[]
): string {
  // Cap at 9 total people (user + up to 8 friends)
  const totalPeople = Math.min(friends.length + 1, 9);

  return `Create a FAMILY-PHOTO STYLE group portrait featuring all ${totalPeople} referenced individuals.  
Preserve each person's exact likeness: facial structure, proportions, skin tone, and identity.

STYLE TRANSFORMATION (HIGH PRIORITY):
Transform the entire group into a unified stylized digital cartoon in the 
Heavy-Lined, Oversized Eye Caricature style:
- Extremely thick, uneven black outlines
- Enormous, wide-set eyes with small irises
- Subtle dark under-eye bags
- Simple block colors
- Minimal soft shading
- Clean polished digital cartoon finish
- Exaggerated but flattering proportions

CHRISTMAS FAMILY-PHOTO VIBE (APPLY STRONGLY):
- Warm glowing indoor Christmas setting (living room)
- Decorated Christmas tree with lights in the background
- Cozy warm lighting (golden holiday glow)
- Soft falling snow visible through a window behind them
- Subtle red, green, and gold color accents throughout the scene
- Gentle sparkle effects for a magical holiday atmosphere
- Classic "holiday portrait" composition

GROUP COMPOSITION (FAMILY PHOTO STYLE):
- Characters posed closely together like a family Christmas portrait
- Natural, warm expressions: gentle smiles or slight holiday smirks
- Everyone wearing cozy, well-coordinated festive outfits:
    * deep-brown winter sweaters or suit jackets  
    * warm scarves with Christmas palette trims  
    * subtle festive accessories (optional)
- Optional: a couple of holiday-themed stemmed glasses (mulled wine look)

OUTPUT REQUIREMENTS:
- Single cohesive group family portrait
- Highly stylized digital cartoon art
- Sharp, detailed rendering
- 1k quality
- --ar 1:1`;
}
