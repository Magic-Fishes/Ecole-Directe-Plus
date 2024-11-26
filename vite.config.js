import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import fs from 'fs';
import path from 'path';

// Define paths for iframe scripts
const iframeFilePath = path.resolve(__dirname, 'src/utils/iframeRequest/iframe.js');
const iframeRequestLinkerFilePath = path.resolve(__dirname, 'src/utils/iframeRequest/iframeRequestLinker.js');

// Plugin to watch for modifications in specified files
const watchModification = (filePaths) => ({
    name: 'watch-iframe-modification',
    configureServer(server) {
        filePaths.forEach(filePath => server.watcher.add(filePath));
        server.watcher.on('change', (changedFile) => {
            if (filePaths.includes(changedFile)) {
                console.log(`${changedFile} has changed. Refreshing...`);
                server.ws.send({ type: 'full-reload', path: '*' });
            }
        });
    }
});

// Plugin to replace a placeholder with iframe script content
const replaceIframeScript = (filePath) => ({
    name: 'replace-iframe-script',
    enforce: "pre",
    transform(file, id) {
        if (id.endsWith("/index.jsx")) {
            const iframeCode = fs.readFileSync(filePath, 'utf-8');
            const scriptContent = iframeCode.slice(iframeCode.indexOf("*/") + 2);
            return file.replace("IFRAME_JS_PLACEHOLDER", scriptContent);
        }
    }
});

// Vite configuration
export default defineConfig({
    plugins: [
        react(),
        basicSsl(),
        replaceIframeScript(iframeFilePath),
        watchModification([iframeFilePath, iframeRequestLinkerFilePath]),
    ],
    server: {
        https: true,
        port: 3000,
    },
});
