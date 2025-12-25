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
  style: "Heavy-Lined Oversized Eye Caricature",
  artisticInfluence:
    "thick black outlines, enormous eyes, polished digital cartoon",

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
 * Heavy-Lined, Oversized Eye Caricature Style
 */
const STYLE_ANCHOR = `
ARTISTIC STYLE (MANDATORY - Heavy-Lined Oversized Eye Caricature):
- Extremely thick, uneven black outlines
- Enormous, wide-set eyes with small irises
- Subtle dark under-eye bags for character depth
- Simple block colors with minimal soft shading
- Clean polished digital cartoon finish
- Exaggerated but flattering proportions
- Stylized digital cartoon rendering
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
 *
 * @param user - The main user generating the FOF
 * @param friends - List of mutual friends
 * @returns Optimized prompt string for Fal.ai
 */
export function buildFOFPrompt(
  user: UserWithFriends["user"],
  friends: FriendData[]
): string {
  const friendCount = friends.length;

  // Build friend reference text
  const friendText = buildFriendDescription(friends);

  // Determine composition based on group size
  const composition = getCompositionForGroupSize(friendCount + 1); // +1 for user

  // Build the master prompt
  return `
${CONFIG.quality}

SUBJECT:
A heartwarming group portrait of @${user.username} (${user.displayName}) surrounded by their ${friendCount} closest Farcaster friends${friendText}.

${composition}

${STYLE_ANCHOR}

${CHRISTMAS_THEME}

EXPRESSIONS & POSES:
- Everyone with genuine, warm smiles
- Natural relaxed poses (no stiff formal photos)
- Some looking at camera, some at each other
- Subtle personality in each character
- Arms around shoulders, cozy proximity

WARDROBE (COORDINATED BUT NOT MATCHING):
- Mix of cozy sweaters, cardigans, festive scarves
- Color harmony: burgundy, cream, forest green, gold
- Subtle festive touches: snowflake patterns, reindeer pins
- Optional: someone holding a gift, someone with cocoa mug

LIGHTING:
- Key light: warm golden from fireplace/tree lights
- Fill light: soft ambient from window
- Rim light: subtle backlight for depth
- Catch lights in all eyes

BADGE ELEMENT:
Small elegant badge in bottom-right corner: "${CONFIG.editionEmoji} FOF: ${CONFIG.edition}"

${NEGATIVE_PROMPT}

OUTPUT: ${CONFIG.aspectRatio} square format, publication-ready quality
`.trim();
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
    return `${CONFIG.quality}, solo portrait of @${username} in cozy Christmas setting, ${CONFIG.style}, thick black outlines, enormous wide-set eyes, block colors, warm golden lighting, decorated tree background, wearing festive sweater, genuine smile, badge "FOF: ${CONFIG.edition}"`;
  }

  return `${CONFIG.quality}, heartwarming group portrait of @${username} with ${friendCount} friends in cozy Christmas setting, ${CONFIG.style}, thick black outlines, enormous wide-set eyes, block colors, warm golden lighting, decorated tree, festive sweaters, genuine smiles, natural poses, badge "FOF: ${CONFIG.edition}"`;
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
