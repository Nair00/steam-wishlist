import { useState } from 'react';
import { SteamUser, WishlistItem } from '../types/steam';
import steamService from '../services/steamService';
import { UserProfile } from './UserProfile';
import { GameCard } from './GameCard';

type SortOption = 'name' | 'price' | 'discount' | 'date_added' | 'release_date';

export const Wishlist = () => {
  const [steamId, setSteamId] = useState('');
  const [user, setUser] = useState<SteamUser | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date_added');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLoadingProgress(0);
    setWishlist([]);
    setUser(null);
    
    try {
      const identifier = extractSteamIdentifier(steamId);
      
      // Try to resolve vanity URL first if it's not a numeric ID
      let resolvedId = identifier;
      if (!identifier.match(/^\d+$/)) {
        try {
          resolvedId = await steamService.resolveVanityURL(identifier);
        } catch (err) {
          setError('Could not resolve custom URL. Please try using your Steam ID instead.');
          setLoading(false);
          return;
        }
      }
      
      // Get user info first
      const userInfo = await steamService.getUserInfo(resolvedId);
      setUser(userInfo);

      // Then get wishlist with progress updates
      const wishlistData = await steamService.getWishlist(
        resolvedId,
        (progress) => {
          setLoadingProgress(progress);
        }
      );

      const wishlistArray = Object.values(wishlistData);
      setWishlist(wishlistArray);
    } catch (err) {
      setError('Failed to fetch Steam data. Please check the Steam ID and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const extractSteamIdentifier = (input: string): string => {
    // Handle full profile URLs
    const profileUrlMatch = input.match(/\/profiles\/(\d+)/);
    if (profileUrlMatch) return profileUrlMatch[1];

    // Handle vanity URLs
    const vanityUrlMatch = input.match(/\/id\/([^/]+)/);
    if (vanityUrlMatch) return vanityUrlMatch[1];

    // Handle custom URLs
    const customUrlMatch = input.match(/steamcommunity\.com\/([^/]+)\/([^/?]+)/);
    if (customUrlMatch && customUrlMatch[1] !== 'profiles') {
      return customUrlMatch[2];
    }

    // If it's just an ID or vanity name, return as is
    return input.trim();
  };

  const sortedWishlist = [...wishlist].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'price':
        const aPrice = a.price_info?.final || 0;
        const bPrice = b.price_info?.final || 0;
        comparison = aPrice - bPrice;
        break;
      case 'discount':
        const aDiscount = a.price_info?.discount_percent || 0;
        const bDiscount = b.price_info?.discount_percent || 0;
        comparison = bDiscount - aDiscount;
        break;
      case 'date_added':
        comparison = a.added - b.added;
        break;
      case 'release_date':
        const aDate = new Date(a.release_date || '').getTime() || Number.MAX_SAFE_INTEGER;
        const bDate = new Date(b.release_date || '').getTime() || Number.MAX_SAFE_INTEGER;
        comparison = aDate - bDate;
        break;
      default:
        return 0;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-white">Steam Wishlist Viewer</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={steamId}
            onChange={(e) => setSteamId(e.target.value)}
            placeholder="Enter Steam ID, profile URL, or custom URL"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'View Wishlist'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      {loading && (
        <div className="max-w-md mx-auto mb-8">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-center text-gray-400 mt-2">
            Loading wishlist... {Math.round(loadingProgress)}%
          </p>
        </div>
      )}

      {user && (
        <>
          <UserProfile user={user} />
          
          {wishlist.length > 0 && (
            <div className="mb-6 flex justify-end gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date_added">Sort by Date Added</option>
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="discount">Sort by Discount</option>
                <option value="release_date">Sort by Release Date</option>
              </select>

              <button
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedWishlist.map((game) => (
              <GameCard key={game.app_id} game={game} />
            ))}
          </div>

          {wishlist.length === 0 && !loading && (
            <p className="text-center text-gray-400">No items in wishlist</p>
          )}
        </>
      )}
    </div>
  );
};
