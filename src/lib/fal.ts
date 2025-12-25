import { fal } from "@fal-ai/client";
import { env } from "@/lib/env";

// =============================================================================
// FAL.AI CLIENT - Optimized for FOF Image Generation
// =============================================================================

// Configure Fal.ai client
fal.config({
  credentials: env.falKey,
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
  primaryModel: "fal-ai/nano-banana-pro/edit",
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

  const imageUrls = profilePictureUrls
    .filter((url) => url && url.startsWith("http"))
    .slice(0, FAL_CONFIG.maxReferenceImages);

  // Build enhanced prompt with image references
  const enhancedPrompt = buildEnhancedPrompt(prompt, imageUrls);

  try {
    // Use nano-banana-pro/edit for image editing with references
    const result = await fal.subscribe(FAL_CONFIG.primaryModel, {
      input: {
        prompt: enhancedPrompt,
        // Ensure image_urls is string[] or key is omitted. spread operator logic was safer for optional keys?
        // But types might require key exist?. No, previous error said 'string[] | undefined' not assignable to 'string[]'.
        // This implies input type expects 'string[]'.
        // I will trust the spread pattern, or just pass default empty array if that's allowed by model.
        // Actually, looking at docs, image_urls should be a list.
        image_urls: imageUrls,
        num_images: 1,
        aspect_ratio: "1:1", // Square output for FOF portraits
        output_format: "png",
      },
      logs: false,
      onQueueUpdate: () => {},
    });

    const data = result.data as any;
    const image = data.images?.[0] || data.image;
    const inferenceTime = Date.now() - startTime;

    return {
      imageUrl: typeof image === "string" ? image : image.url,
      seed: data.seed || 0,
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
