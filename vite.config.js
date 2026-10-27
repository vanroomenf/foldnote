import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative paths so the built site works on GitHub Pages (username.github.io/foldnote/)
// as well as on any other host.
export default defineConfig({ plugins: [react()], base: "./" });
