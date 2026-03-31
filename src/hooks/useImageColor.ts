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

      // Higher resolution sample for better accuracy
      canvas.width = 20;
      canvas.height = 20;
      ctx.drawImage(img, 0, 0, 20, 20);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let vibrantColor = fallback;
        let maxSecondaryScore = -1;

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];

          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (a < 128 || brightness < 40 || brightness > 220) continue;

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max === 0 ? 0 : (max - min) / max;
          
          // Spotify-like algorithm: heavily weighted saturation with a brightness boost
          // This avoids the common "muddy brown" issue and pulls out the intense reds/blues.
          const score = (saturation * 3) + (brightness / 255);
          
          if (score > maxSecondaryScore) {
            maxSecondaryScore = score;
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
