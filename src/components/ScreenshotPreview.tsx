import { useEffect, useState } from "react";

interface ScreenshotPreviewProps {
  screenshots: string[];
  isVisible: boolean;
  headerImage: string;
}

export const ScreenshotPreview = ({
  screenshots,
  isVisible,
  headerImage,
}: ScreenshotPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  useEffect(() => {
    if (!isVisible) {
      // Reset state when preview becomes invisible
      setCurrentIndex(0);
      setLoadedImages([]);
      return;
    }

    let isMounted = true;
    let currentInterval: number | undefined;

    // Start loading images only when component becomes visible
    const loadImages = async () => {
      // Load first image immediately
      if (screenshots.length > 0 && isMounted) {
        const img = new Image();
        img.onload = () => {
          if (isMounted) {
            setLoadedImages([screenshots[0]]);
            // Start loading remaining images only after first one is shown
            loadRemainingImages();
          }
        };
        img.src = screenshots[0];
      }
    };

    const loadRemainingImages = async () => {
      // Load remaining images sequentially
      for (let i = 1; i < screenshots.length && isMounted; i++) {
        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => {
            if (isMounted) {
              setLoadedImages((prev) => [...prev, screenshots[i]]);
            }
            resolve();
          };
          img.src = screenshots[i];
        });
      }

      // Only start rotation after at least 2 images are loaded
      if (isMounted && screenshots.length > 1) {
        currentInterval = window.setInterval(() => {
          if (isMounted) {
            setCurrentIndex((prev) => (prev + 1) % screenshots.length);
          }
        }, 1000); // 1 seconds per screenshot
      }
    };

    loadImages();

    return () => {
      isMounted = false;
      if (currentInterval) {
        clearInterval(currentInterval);
      }
    };
  }, [isVisible, screenshots]);

  if (!isVisible || screenshots.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-black">
      {/* Always show header image */}
      <img
        src={headerImage}
        alt="Game header"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          loadedImages.length === 0 ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Show screenshots once loaded */}
      {screenshots.map((screenshot, index) => (
        <img
          key={screenshot}
          src={loadedImages.includes(screenshot) ? screenshot : ""}
          alt={`Screenshot ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            loadedImages.length > 0 && index === currentIndex
              ? "opacity-100"
              : "opacity-0"
          }`}
          loading="lazy"
        />
      ))}
    </div>
  );
};
