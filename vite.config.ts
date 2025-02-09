import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Simple key obfuscation function
const obfuscateKey = (key: string): string[] => {
  // Split key into chunks and encode each chunk
  const chunks = key.match(/.{1,8}/g) || [];
  return chunks.map(chunk => 
    Buffer.from(chunk).toString('base64')
  );
}

const deobfuscateKey = (chunks: string[]): string => {
  return chunks
    .map(chunk => Buffer.from(chunk, 'base64').toString())
    .join('');
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const keyChunks = obfuscateKey(env.VITE_STEAM_API_KEY);

  // Function to get deobfuscated key for each request
  const getKey = () => deobfuscateKey(keyChunks);

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/steam/user': {
          target: 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2',
          changeOrigin: true,
          rewrite: (path) => {
            const steamId = path.replace(/^\/api\/steam\/user\//, '');
            return `/?key=${getKey()}&steamids=${steamId}`;
          },
        },
        '/api/steam/resolve': {
          target: 'https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1',
          changeOrigin: true,
          rewrite: (path) => {
            const vanityUrl = path.replace(/^\/api\/steam\/resolve\//, '');
            return `/?key=${getKey()}&vanityurl=${vanityUrl}`;
          },
        },
        '/api/steam/wishlist': {
          target: 'https://api.steampowered.com/IWishlistService/GetWishlist/v1',
          changeOrigin: true,
          rewrite: (path) => {
            const steamId = path.replace(/^\/api\/steam\/wishlist\//, '');
            return `?steamid=${steamId}&count=2000`;
          },
        },
        '/api/steam/store/appdetails': {
          target: 'https://api.steampowered.com/IStoreBrowseService/GetItems/v1',
          changeOrigin: true,
          rewrite: (path) => {
            const queryString = new URLSearchParams(path.split('?')[1] || '');
            const input_json = queryString.get('input_json');
            return `?key=${getKey()}&input_json=${input_json}`;
          },
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, _req, _res) => {
              proxyReq.setHeader('Accept', 'application/json');
              proxyReq.setHeader('Accept-Language', 'en-US,en;q=0.7');
              proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
            });
          },
        },
      },
    },
  }
})
