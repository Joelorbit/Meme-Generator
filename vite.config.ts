import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("src/lib/icons/registry")) {
            return "iconoir-registry";
          }
          if (id.includes("node_modules/bits-ui")) {
            return "bits-ui";
          }
        },
      },
    },
  },
});
