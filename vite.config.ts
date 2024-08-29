import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "docs",
  },
  base: "/TokenHolders/", // Important: Set the base URL to match your GitHub Pages URL
});
