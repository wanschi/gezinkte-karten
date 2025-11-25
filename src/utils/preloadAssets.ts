/**
 * Preloads an image by creating an Image object and setting its src.
 * Returns a promise that resolves when the image loads or rejects on error.
 */
function preloadImage(src: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise((resolve, _reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => {
      // Log error but don't fail the entire preload process
      console.warn(`Failed to preload image: ${src}`);
      resolve(); // Resolve anyway to continue preloading other images
    };
    img.src = src;
  });
}

/**
 * Preloads all provided image paths.
 * This function loads images in parallel for better performance.
 */
export async function preloadAssets(paths: string[]): Promise<void> {
  try {
    await Promise.all(paths.map(preloadImage));
    console.log(`Successfully preloaded ${paths.length} assets`);
  } catch (error) {
    console.error("Error during asset preloading:", error);
  }
}

