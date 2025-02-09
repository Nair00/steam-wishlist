export interface SteamUser {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
}

export interface WishlistItem {
  name: string;
  capsule: string;
  review_score: number;
  review_desc: string;
  reviews_total: string;
  reviews_percent: number;
  release_date: string;
  release_string: string;
  platform_icons: string;
  subs: Array<{
    id: number;
    discount_block: string;
    price: number;
    discount_pct: number;
  }>;
  type: string;
  screenshots: string[];
  review_css: string;
  priority: number;
  added: number;
  background: string;
  rank: number;
  tags: string[];
  is_free_game: boolean;
  win: boolean;
  mac: boolean;
  linux: boolean;
  app_id: number;
  store_url: string;
  price_info: {
    initial: number;
    final: number;
    discount_percent: number;
    currency: string;
  };
  developers?: string[];
  publishers?: string[];
}

export interface WishlistResponse {
  [key: string]: WishlistItem;
}

export interface WishlistEntry {
  appid: number;
  priority: number;
  added: number;
}

export interface StoreItemAssets {
  asset_url_format: string;
  small_capsule: string;
  header: string;
  library_capsule: string;
}

export interface StoreItemBasicInfo {
  developers: Array<{ name: string }>;
  publishers: Array<{ name: string }>;
}

export interface StoreItemPurchaseOption {
  packageid: number;
  purchase_option_name: string;
  final_price_in_cents: string;
  formatted_final_price: string;
  discount_pct?: number;
}

export interface StoreItem {
  id: number;
  success: boolean;
  visible: boolean;
  name: string;
  store_url_path: string;
  appid: number;
  assets: StoreItemAssets;
  basic_info: StoreItemBasicInfo;
  best_purchase_option: StoreItemPurchaseOption;
  platforms?: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  release_date?: {
    coming_soon: boolean;
    date: string;
  };
}
