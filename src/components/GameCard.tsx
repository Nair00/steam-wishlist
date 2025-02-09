import { memo, useState, useCallback, useEffect, useRef } from "react";
import { ScreenshotPreview } from "./ScreenshotPreview";
import { WishlistItem } from "../types/steam";

interface GameCardProps {
  game: WishlistItem;
}

export const GameCard = memo(({ game }: GameCardProps) => {
  const [showScreenshots, setShowScreenshots] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const { price_info } = game;
  if(game.app_id === 1030300){
    console.log(game);
  }
  const hasDiscount = price_info?.discount_percent > 0;
  const isFree = price_info?.final === 0;

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = window.setTimeout(() => {
      setShowScreenshots(true);
    }, 200);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowScreenshots(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow contain-layout flex flex-col justify-between">
      <div 
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={game.capsule}
          alt={game.name}
          className="w-full object-cover"
          loading="lazy"
        />
        {game.screenshots.length > 0 && (
          <ScreenshotPreview
            screenshots={game.screenshots}
            isVisible={showScreenshots}
            headerImage={game.capsule}
          />
        )}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded">
            -{price_info.discount_percent}%
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between flex-1">
        <h3 className="text-xl font-bold mb-2 text-white line-clamp-2 flex-1">
          {game.name}
        </h3>

        <div className="flex items-center mb-2 space-x-2">
          {game.win && (
            <span className="text-gray-400">
              <i className="fab fa-windows"></i>
            </span>
          )}
          {game.mac && (
            <span className="text-gray-400">
              <i className="fab fa-apple"></i>
            </span>
          )}
          {game.linux && (
            <span className="text-gray-400">
              <i className="fab fa-linux"></i>
            </span>
          )}
        </div>

        <div className="text-sm text-gray-400 mb-2">
          {game.developers && game.developers.length > 0 && (
            <div className="line-clamp-1">
              Developer: {game.developers.join(", ")}
            </div>
          )}
          {game.publishers && game.publishers.length > 0 && (
            <div className="line-clamp-1">
              Publisher: {game.publishers.join(", ")}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {game.review_score > 0 && (
              <div className="text-sm">
                <span
                  className={`${
                    game.review_score >= 7
                      ? "text-green-500"
                      : game.review_score >= 5
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {game.review_desc}
                </span>
              </div>
            )}
          </div>

          <div className="text-right">
            {isFree ? (
              <span className="text-green-500 font-bold">Free</span>
            ) : price_info ? (
              hasDiscount ? (
                <div>
                  <span className="text-gray-400 line-through text-sm">
                    {price_info.initial.toFixed(2)}
                    {price_info.currency}
                  </span>
                  <span className="text-green-500 font-bold ml-2">
                    {price_info.final.toFixed(2)}
                    {price_info.currency}
                  </span>
                </div>
              ) : (
                <span className="text-white font-bold">
                  {price_info.final.toFixed(2)}
                  {price_info.currency}
                </span>
              )
            ) : (
              <span className="text-gray-400">N/A</span>
            )}
          </div>
        </div>

        <div className="mt-2 text-sm text-gray-400">
          Added: {new Date(game.added * 1000).toLocaleDateString()}
        </div>

        {game.release_date && (
          <div className="mt-1 text-sm text-gray-400">
            Release: {game.release_string}
          </div>
        )}

        <a
          href={game.store_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
        >
          View on Steam
        </a>
      </div>
    </div>
  );
});

GameCard.displayName = "GameCard";
