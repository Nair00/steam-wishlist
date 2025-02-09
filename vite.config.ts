import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/'
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: mode === "production" ? "/steam-wishlist/" : "/",
    build: {
      outDir: "dist",
      rollupOptions: {
        input: resolve(__dirname, "index.html"),
      },
    },
    server: {
      proxy: {
        "/api/steam/user": {
          target:
            "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2",
          changeOrigin: true,
          rewrite: (path) => {
            const steamId = path.replace(/^\/api\/steam\/user\//, "");
            const queryString = new URLSearchParams(path.split("?")[1] || "");
            return `/?key=${queryString.get("key")}&steamids=${steamId}`;
          },
        },
        "/api/steam/resolve": {
          target: "https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1",
          changeOrigin: true,
          rewrite: (path) => {
            const vanityUrl = path.replace(/^\/api\/steam\/resolve\//, "");
            const queryString = new URLSearchParams(path.split("?")[1] || "");
            return `/?key=${queryString.get("key")}&vanityurl=${vanityUrl}`;
          },
        },
        "/api/steam/wishlist": {
          target:
            "https://api.steampowered.com/IWishlistService/GetWishlist/v1",
          changeOrigin: true,
          rewrite: (path) => {
            const steamId = path.replace(/^\/api\/steam\/wishlist\//, "");
            const queryString = new URLSearchParams(path.split("?")[1] || "");
            return `?key=${queryString.get(
              "key"
            )}&steamid=${steamId}&count=2000`;
          },
        },
        "/api/steam/store/appdetails": {
          target:
            "https://api.steampowered.com/IStoreBrowseService/GetItems/v1",
          changeOrigin: true,
          rewrite: (path) => {
            const queryString = new URLSearchParams(path.split("?")[1] || "");
            return `?key=${queryString.get("key")}&input_json=${queryString.get(
              "input_json"
            )}`;
          },
          configure: (proxy, _options) => {
            proxy.on("proxyReq", (proxyReq, _req, _res) => {
              proxyReq.setHeader("Accept", "application/json");
              proxyReq.setHeader("Accept-Language", "en-US,en;q=0.7");
              proxyReq.setHeader(
                "User-Agent",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
              );
            });
          },
        },
      },
    },
  };
});
