import { fal } from "@fal-ai/client";

// =============================================================================
// FAL.AI CLIENT - Optimized for FOF Image Generation
// =============================================================================

// Configure Fal.ai client
fal.config({
  credentials: process.env.FAL_KEY,
});

export { fal };

// =============================================================================
// TYPES
// =============================================================================

export interface GenerationResult {
  imageUrl: string;
  seed: number;
  inferenceTime?: number;
}

export interface GenerationOptions {
  /** Reference images (profile pictures) */
  referenceImages?: string[];
  /** Retry attempt number (for variation selection) */
  retryAttempt?: number;
  /** Force higher quality (slower) */
  highQuality?: boolean;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const FAL_CONFIG = {
  // Model selection
  primaryModel: "fal-ai/flux-pro/v1.1",
  fallbackModel: "fal-ai/flux/dev",

  // Image settings
  imageSize: "square_hd" as const,

  // Quality vs speed tradeoffs
  defaultSteps: 28,
  highQualitySteps: 40,

  // Safety
  safetyTolerance: "2",

  // Limits
  maxReferenceImages: 9,
} as const;

// =============================================================================
// MAIN GENERATION FUNCTION
// =============================================================================

/**
 * Generate FOF image using Fal.ai FLUX Pro
 *
 * This function:
 * 1. Prepares reference images (profile pictures)
 * 2. Enhances the prompt for multi-image generation
 * 3. Runs generation with optimal settings
 * 4. Returns the result with metadata
 *
 * @param prompt - The master prompt from buildFOFPrompt
 * @param options - Generation options including reference images
 */
export async function generateFOFWithReferences(
  prompt: string,
  profilePictureUrls: string[],
  options: GenerationOptions = {}
): Promise<GenerationResult> {
  const startTime = Date.now();

  // Prepare reference images (limit to max allowed)
  const imageUrls = profilePictureUrls
    .filter((url) => url && url.startsWith("http"))
    .slice(0, FAL_CONFIG.maxReferenceImages);

  console.log(
    `[Fal.ai] Starting generation with ${imageUrls.length} reference images`
  );

  // Build enhanced prompt with image references
  const enhancedPrompt = buildEnhancedPrompt(prompt, imageUrls);

  try {
    // Use FLUX Pro for multi-reference generation
    const result = await fal.subscribe(FAL_CONFIG.primaryModel, {
      input: {
        prompt: enhancedPrompt,
        image_size: FAL_CONFIG.imageSize,
        num_images: 1,
        safety_tolerance: FAL_CONFIG.safetyTolerance,
        // Pass reference images if available
        ...(imageUrls.length > 0 && { image_urls: imageUrls }),
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("[Fal.ai] Generation in progress...");
        }
      },
    });

    const image = result.data.images[0];
    const inferenceTime = Date.now() - startTime;

    console.log(`[Fal.ai] Generation complete in ${inferenceTime}ms`);

    return {
      imageUrl: image.url,
      seed: result.data.seed || 0,
      inferenceTime,
    };
  } catch (error) {
    console.error("[Fal.ai] Primary model failed:", error);

    // Fallback to dev model without references
    return generateFallback(prompt, options);
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Build enhanced prompt with image reference instructions
 */
function buildEnhancedPrompt(prompt: string, imageUrls: string[]): string {
  if (imageUrls.length === 0) {
    return prompt;
  }

  // Create reference mapping
  const referenceText = imageUrls.map((_, i) => `[Image ${i + 1}]`).join(", ");

  // Add reference instruction to prompt
  const referenceInstruction = `
REFERENCE IMAGES (USE FOR FACE LIKENESS):
The following ${imageUrls.length} reference images show the actual faces of the people in this portrait.
Use these as guides for facial features, but apply the artistic style transformation.
References: ${referenceText}

IMPORTANT: Preserve the distinctive features that make each person recognizable,
but render them in the specified artistic style (not photorealistic).
`;

  return `${referenceInstruction}\n\n${prompt}`;
}

/**
 * Fallback generation when primary model fails
 */
async function generateFallback(
  prompt: string,
  options: GenerationOptions = {}
): Promise<GenerationResult> {
  console.log("[Fal.ai] Using fallback model...");

  const steps = options.highQuality
    ? FAL_CONFIG.highQualitySteps
    : FAL_CONFIG.defaultSteps;

  const result = await fal.subscribe(FAL_CONFIG.fallbackModel, {
    input: {
      prompt,
      image_size: FAL_CONFIG.imageSize,
      num_inference_steps: steps,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true,
    },
    logs: true,
  });

  const image = result.data.images[0];

  return {
    imageUrl: image.url,
    seed: result.data.seed,
  };
}

/**
 * Generate FOF image without references (simple mode)
 */
export async function generateFOFImage(
  prompt: string
): Promise<GenerationResult> {
  return generateFallback(prompt, { highQuality: true });
}

/**
 * Validate that Fal.ai is properly configured
 */
export function validateFalConfig(): boolean {
  const key = process.env.FAL_KEY;
  if (!key) {
    console.error("[Fal.ai] FAL_KEY environment variable not set");
    return false;
  }
  return true;
}
