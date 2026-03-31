import { useState, useEffect } from 'react';

/**
 * Custom hook to extract the dominant vibrant color from an image URL using Canvas API.
 * This matches Spotify's "Immersive" feel without adding heavy libraries.
 */
export function useImageColor(imageUrl?: string, fallback: string = 'var(--primary)') {
  const [color, setColor] = useState<string>(fallback);

  useEffect(() => {
    if (!imageUrl) {
      setColor(fallback);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Small sample size for performance
      canvas.width = 10;
      canvas.height = 10;
      ctx.drawImage(img, 0, 0, 10, 10);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let vibrantColor = fallback;
        let maxIntensity = -1;

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          // Skip transparent or very dark/bright pixels (Spotify excludes extremes)
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (a < 128 || brightness < 30 || brightness > 220) continue;

          // Simple saturation check to find "vibrant" colors
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          
          // Spotify favors vibrant colors over muddy ones
          const intensity = saturation * brightness;
          
          if (intensity > maxIntensity) {
            maxIntensity = intensity;
            vibrantColor = `rgb(${r}, ${g}, ${b})`;
          }
        }

        setColor(vibrantColor);
      } catch (e) {
        console.warn("Color extraction failed due to CORS or Canvas error", e);
        setColor(fallback);
      }
    };

    img.onerror = () => {
      setColor(fallback);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, fallback]);

  return color;
}
