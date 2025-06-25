import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "app": path.resolve(__dirname, "src/app"),
      "pages": path.resolve(__dirname, "src/pages"),
      "widgets": path.resolve(__dirname, "src/widgets"),
      "features": path.resolve(__dirname, "src/features"),
      "entities": path.resolve(__dirname, "src/entities"),
      "shared": path.resolve(__dirname, "src/shared"),
    },
  },
});
