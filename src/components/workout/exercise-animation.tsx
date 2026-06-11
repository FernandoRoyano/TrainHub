"use client";

import { useState, useEffect, useMemo } from "react";
import { Image as ImageIcon } from "lucide-react";

interface ExerciseAnimationProps {
  thumbnailUrl: string | null | undefined;
  alt?: string;
  className?: string;
}

function getAnimationUrls(url: string): [string, string] | null {
  // Pattern: .../exercises/Exercise_Name/0.jpg → also load 1.jpg
  const match = url.match(/^(.*\/exercises\/[^/]+\/)(\d+)(\.jpg)$/);
  if (match) {
    return [`${match[1]}0${match[3]}`, `${match[1]}1${match[3]}`];
  }
  return null;
}

export function ExerciseAnimation({
  thumbnailUrl,
  alt = "",
  className = "w-12 h-12 rounded-md object-cover",
}: ExerciseAnimationProps) {
  const [frame, setFrame] = useState(0);
  const [hasSecondFrame, setHasSecondFrame] = useState(false);
  // Memo: un array nuevo en cada render hacía que el efecto del intervalo se
  // destruyera/recreara con cada re-render del padre (p. ej. al teclear reps)
  // y la animación se quedara visualmente congelada
  const urls = useMemo(
    () => (thumbnailUrl ? getAnimationUrls(thumbnailUrl) : null),
    [thumbnailUrl]
  );

  useEffect(() => {
    if (!urls) return;

    // Preload second image to check it exists
    const img = new window.Image();
    img.onload = () => setHasSecondFrame(true);
    img.onerror = () => setHasSecondFrame(false);
    img.src = urls[1];
  }, [urls?.[1]]);

  useEffect(() => {
    if (!hasSecondFrame || !urls) return;

    const interval = setInterval(() => {
      setFrame((f) => (f === 0 ? 1 : 0));
    }, 1200);

    return () => clearInterval(interval);
  }, [hasSecondFrame, urls]);

  if (!thumbnailUrl) {
    return (
      <div className={`${className} bg-muted flex items-center justify-center`}>
        <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
      </div>
    );
  }

  const src = hasSecondFrame && urls ? urls[frame] : thumbnailUrl;

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} shrink-0`}
    />
  );
}
