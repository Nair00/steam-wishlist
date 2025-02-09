import axios from 'axios';
import { SteamUser, WishlistResponse, WishlistEntry, StoreItem, WishlistItem } from '../types/steam';

const ITEMS_PER_PAGE = 100; // Maximum number of items to fetch at once

// Create an axios instance
const api = axios.create();

class SteamService {
  private static instance: SteamService;
  private constructor() {}

  static getInstance(): SteamService {
    if (!this.instance) {
      this.instance = new SteamService();
    }
    return this.instance;
  }

  async getUserInfo(steamId: string): Promise<SteamUser> {
    try {
      const response = await api.get(`/api/steam/user/${steamId}`);
      return response.data.response.players[0];
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  private async getWishlistEntries(steamId: string): Promise<WishlistEntry[]> {
    try {
      // Get the wishlist data from IWishlistService through our proxy
      const response = await api.get(`/api/steam/wishlist/${steamId}`);

      if (!response.data?.response?.items) {
        console.error('Invalid wishlist response:', response.data);
        throw new Error('Invalid wishlist response format');
      }

      return response.data.response.items;
    } catch (error) {
      console.error('Error fetching wishlist entries:', error);
      throw error;
    }
  }

  private async getStoreItems(appIds: number[]): Promise<StoreItem[]> {
    try {
      // Get store data for all app IDs in a single request
      const response = await api.get('/api/steam/store/appdetails', {
        params: {
          input_json: JSON.stringify({
            ids: appIds.map(appId => ({appid: appId})),
            data_request: {
              include_basic_info: true,
              include_assets: true,
              include_platforms: true,
              include_release: true,
              include_all_purchase_options: true,
            },
            context: {
              language: 'english',
              country_code: 'RO',
            }
          }),
        }
      });

      if (!response.data?.response?.store_items) {
        throw new Error('Invalid store items response format');
      }

      // Create a map of appId to store item for easier lookup
      const storeItemsMap = new Map(
        response.data.response.store_items
          .filter((item: StoreItem) => item.success && item.visible)
          .map((item: StoreItem) => [item.appid, item])
      );

      // Return store items in the same order as the input appIds
      return appIds
        .map(appId => storeItemsMap.get(appId))
        .filter((item): item is StoreItem => item !== undefined);
    } catch (error) {
      console.error('Error fetching store items:', error);
      throw error;
    }
  }

  private transformStoreItemToWishlistItem(item: StoreItem, entry: WishlistEntry): WishlistItem {
    const assetBaseUrl = item.assets.asset_url_format.replace('${FILENAME}', item.assets.header);
    const capsuleUrl = `https://shared.fastly.steamstatic.com/store_item_assets/${assetBaseUrl}`;

    return {
      name: item.name,
      capsule: capsuleUrl,
      review_score: 0, // Not available in this API
      review_desc: '', // Not available in this API
      reviews_total: '', // Not available in this API
      reviews_percent: 0, // Not available in this API
      release_date: item.release_date?.date || '',
      release_string: item.release_date?.date || 'TBA',
      platform_icons: '',
      subs: [],
      type: 'game',
      screenshots: [],
      review_css: '',
      priority: entry.priority,
      added: entry.added,
      background: '',
      rank: 0,
      tags: [],
      is_free_game: item.best_purchase_option?.final_price_in_cents === '0',
      win: item.platforms?.windows || false,
      mac: item.platforms?.mac || false,
      linux: item.platforms?.linux || false,
      app_id: item.appid,
      store_url: `https://store.steampowered.com/${item.store_url_path}`,
      price_info: {
        initial: parseInt(item.best_purchase_option?.final_price_in_cents || '0') / 100,
        final: parseInt(item.best_purchase_option?.final_price_in_cents || '0') / 100,
        discount_percent: item.best_purchase_option?.discount_pct || 0,
        currency: item.best_purchase_option?.formatted_final_price?.slice(-1) || '€'
      },
      developers: item.basic_info.developers.map(dev => dev.name),
      publishers: item.basic_info.publishers.map(pub => pub.name)
    };
  }

  async getWishlist(
    steamId: string,
    onProgress?: (progress: number) => void
  ): Promise<WishlistResponse> {
    try {
      // First get all wishlist entries
      const entries = await this.getWishlistEntries(steamId);
      const wishlistResponse: WishlistResponse = {};
      const totalEntries = entries.length;

      // Process entries in chunks to avoid overloading the API
      for (let i = 0; i < entries.length; i += ITEMS_PER_PAGE) {
        const chunk = entries.slice(i, i + ITEMS_PER_PAGE);
        const appIds = chunk.map(entry => entry.appid);
        const storeItems = await this.getStoreItems(appIds);

        // Combine wishlist entries with store items
        storeItems.forEach((item, index) => {
          const entry = chunk[index];
          const appId = entry.appid.toString();
          wishlistResponse[appId] = this.transformStoreItemToWishlistItem(item, entry);
        });

        // Update progress
        const progress = Math.min(((i + chunk.length) / totalEntries) * 100, 100);
        onProgress?.(progress);

        // Add a small delay between chunks to be nice to the API
        if (i + ITEMS_PER_PAGE < entries.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return wishlistResponse;
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      throw error;
    }
  }

  async resolveVanityURL(vanityURL: string): Promise<string> {
    try {
      const response = await api.get(`/api/steam/resolve/${vanityURL}`);
      if (response.data.response.success === 1) {
        return response.data.response.steamid;
      }
      throw new Error('Could not resolve vanity URL');
    } catch (error) {
      console.error('Error resolving vanity URL:', error);
      throw error;
    }
  }
}

export default SteamService.getInstance();
