import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// Vite configuration
export default defineConfig({
    plugins: [
        react(),
        basicSsl(),
    ],
    server: {
        host: "local.ecole-directe.plus",
        https: true,
        port: 3000,
    },
});
