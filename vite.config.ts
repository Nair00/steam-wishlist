import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/'
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base:
      mode === "production" ? "https://steam-wishlist-neon.vercel.app" : "/",
    build: {
      outDir: "dist",
      rollupOptions: {
        input: resolve(__dirname, "index.html"),
      },
    },
  };
});
