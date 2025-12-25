import { FriendData, UserWithFriends } from "./neynar";

// =============================================================================
// FOF IMAGE GENERATION PROMPTS
// Pro-level Fal.ai prompts for maximum quality and consistency
// =============================================================================

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  // Edition theme (change this for seasonal updates)
  edition: "Christmas 2025",
  editionEmoji: "🎄",

  // Style parameters
  style: "stylized digital cartoon portrait",
  artisticInfluence: "bold outlines, expressive eyes, polished cartoon finish",

  // Composition
  maxFriendsToName: 4,
  aspectRatio: "1:1",

  // Quality
  quality: "masterpiece, best quality, ultra detailed",

  // Safety
  safetyLevel: "family-friendly, wholesome, warm",
} as const;

// =============================================================================
// PROMPT TEMPLATES
// =============================================================================

/**
 * Core visual style anchor - consistency across all generations
 * Stylized Digital Cartoon with Bold Lines
 */
const STYLE_ANCHOR = `
ARTISTIC STYLE (MANDATORY - Stylized Digital Cartoon):
- Bold, clean black outlines (thick but consistent)
- Expressive, slightly enlarged eyes with clear irises
- Simple block colors with soft highlights
- Clean polished digital cartoon finish
- Stylized but natural-looking proportions
- Preserve each person's recognizable likeness
- No distortion, no weird artifacts
- Sharp, detailed, 4k quality output
`.trim();

/**
 * Christmas theme elements
 */
const CHRISTMAS_THEME = `
CHRISTMAS ATMOSPHERE (ESSENTIAL):
- Warm golden ambient lighting (like fireplace glow)
- Cozy indoor setting: living room with decorated tree
- Soft snowfall visible through frosted window
- Color palette: deep burgundy, forest green, gold accents, cream whites
- Subtle fairy light bokeh in background
- Optional: mugs of hot cocoa, wrapped presents, garland
- Feeling: nostalgic, heartwarming, like a holiday memory
`.trim();

/**
 * Negative prompt to avoid common issues
 */
const NEGATIVE_PROMPT = `
AVOID (CRITICAL):
- Distorted faces, asymmetric features, extra limbs
- Horror elements, scary expressions, dark themes
- Overly realistic uncanny valley renders
- Blurry, low quality, pixelated
- Text artifacts, watermarks, signatures (except our badge)
- Cluttered compositions, confusing layouts
- Cold/harsh lighting, blue tones
- Disconnected or floating elements
`.trim();

// =============================================================================
// MAIN PROMPT BUILDER
// =============================================================================

/**
 * Build the master prompt for FOF image generation
 * Uses exactly the specified template with dynamic person count (max 9)
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

/**
 * Build friend description for prompt
 */
function buildFriendDescription(friends: FriendData[]): string {
  if (friends.length === 0) return "";

  const namedFriends = friends.slice(0, CONFIG.maxFriendsToName);
  const names = namedFriends.map((f) => f.displayName || f.username).join(", ");

  if (friends.length <= CONFIG.maxFriendsToName) {
    return `: ${names}`;
  }

  const remaining = friends.length - CONFIG.maxFriendsToName;
  return `: ${names}, and ${remaining} more`;
}

/**
 * Get optimal composition based on group size
 * This is crucial for consistent quality across different group sizes
 */
function getCompositionForGroupSize(totalPeople: number): string {
  if (totalPeople === 1) {
    return `
COMPOSITION (SOLO PORTRAIT):
- Single subject centered, 3/4 body visible
- Slightly angled pose for dynamism
- Christmas tree prominent in background
- Warm vignette effect
`;
  }

  if (totalPeople === 2) {
    return `
COMPOSITION (DUO PORTRAIT):
- Two subjects side by side, slight overlap
- One slightly behind for depth
- Both equally prominent
- Balanced symmetry
`;
  }

  if (totalPeople <= 4) {
    return `
COMPOSITION (SMALL GROUP - ${totalPeople} people):
- Tight cluster arrangement
- Main user slightly forward/centered
- Friends arranged around in natural grouping
- Everyone's face clearly visible
- Triangle or diamond composition
`;
  }

  if (totalPeople <= 7) {
    return `
COMPOSITION (MEDIUM GROUP - ${totalPeople} people):
- Two-row arrangement (front sitting/kneeling, back standing)
- Main user in center-front
- Faces at varying heights for visual interest
- Natural arm-around-shoulder poses
- Slight camera tilt for dynamism
`;
  }

  if (totalPeople <= 12) {
    return `
COMPOSITION (LARGE GROUP - ${totalPeople} people):
- Stadium/tiered arrangement (3 levels)
- Main user prominently placed
- Faces slightly overlapping for cohesion
- Wide angle perspective
- Nobody hidden or cut off
`;
  }

  // 13+ people - challenging but possible
  return `
COMPOSITION (CROWD PORTRAIT - ${totalPeople} people):
- Epic panoramic group photo style
- Main user front and center
- Crowd arranged in natural clusters
- Some faces larger (foreground), some smaller (background)
- Festive, party-like energy
- Slightly elevated camera angle
`;
}

// =============================================================================
// SIMPLIFIED FALLBACK PROMPT
// =============================================================================

/**
 * Simplified prompt for fallback or quick generation
 */
export function buildSimpleFOFPrompt(
  username: string,
  friendCount: number
): string {
  if (friendCount === 0) {
    return `${CONFIG.quality}, solo portrait of @${username} in cozy Christmas setting, ${CONFIG.style}, bold outlines, expressive eyes, block colors, warm golden lighting, decorated tree background, wearing festive sweater, genuine smile, natural proportions, badge "FOF: ${CONFIG.edition}"`;
  }

  return `${CONFIG.quality}, heartwarming group portrait of @${username} with ${friendCount} friends in cozy Christmas setting, ${CONFIG.style}, bold outlines, expressive eyes, block colors, warm golden lighting, decorated tree, festive sweaters, genuine smiles, natural poses, natural proportions, badge "FOF: ${CONFIG.edition}"`;
}

// =============================================================================
// PROMPT VARIATIONS (for retry/regeneration)
// =============================================================================

/**
 * Get a prompt variation for retries
 * Useful when first generation doesn't satisfy
 */
export function getPromptVariation(
  basePrompt: string,
  variationIndex: number
): string {
  const variations = [
    // Original
    basePrompt,
    // More emphasis on likeness
    `${basePrompt}\n\nEMPHASIS: Prioritize accurate facial likeness over artistic style.`,
    // More dynamic
    `${basePrompt}\n\nVARIATION: More dynamic, candid moment - someone laughing, natural movement captured.`,
    // More festive
    `${basePrompt}\n\nVARIATION: Extra festive - more decorations, more sparkle, more holiday magic visible.`,
    // Closer crop
    `${basePrompt}\n\nVARIATION: Tighter crop on faces, more intimate portrait feel.`,
  ];

  return variations[variationIndex % variations.length];
}

// =============================================================================
// EDGE CASE HANDLERS
// =============================================================================

/**
 * Validate and sanitize user display names for prompt safety
 */
export function sanitizeDisplayName(name: string): string {
  // Remove special characters that might confuse the AI
  return name
    .replace(/[<>{}[\]|\\^~`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 50); // Limit length
}

/**
 * Get a fallback prompt when we have no friend data
 */
export function buildSoloFOFPrompt(user: UserWithFriends["user"]): string {
  return `
${CONFIG.quality}

SUBJECT:
A warm, inviting solo portrait of @${user.username} (${sanitizeDisplayName(
    user.displayName
  )}) celebrating the holiday season.

COMPOSITION:
- Single subject centered, 3/4 body visible
- Relaxed, welcoming pose with open body language
- Direct eye contact with warm expression
- Christmas tree with twinkling lights behind

${STYLE_ANCHOR}

${CHRISTMAS_THEME}

SPECIAL NOTES:
- This is a solo portrait celebrating their Farcaster presence
- Capture personality and warmth
- Ready to welcome friends next time

BADGE: "${CONFIG.editionEmoji} FOF: ${CONFIG.edition}"

${NEGATIVE_PROMPT}
`.trim();
}
