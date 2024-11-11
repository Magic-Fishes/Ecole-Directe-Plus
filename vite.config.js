import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import fs from 'fs';
import path from 'path';

const iframeFilePath = path.resolve(__dirname, 'src/utils/iframeRequest/iframe.js');
const iframeRequestLinkerFilePath = path.resolve(__dirname, 'src/utils/iframeRequest/iframeRequestLinker.js');

const watchModification = (filePaths) => ({
    name: 'watch-iframe-modification',
    configureServer(server) {
        filePaths.forEach(filePath => {
            server.watcher.add(filePath);
        });
        server.watcher.on('change', (changedFile) => {
            if (filePaths.includes(changedFile)) {
                console.log(`${changedFile} has changed. Refreshing...`);
                server.ws.send({
                    type: 'full-reload',
                    path: '*'
                });
            }
        });
    }
})

const replaceIframeScript = (filePath) => ({
    name: 'replace-iframe-script',
    enforce: "pre",
    transform(file, id) {
        if (id.endsWith("/index.jsx")) {
            const iframeCode = fs.readFileSync(filePath, 'utf-8');
            return file.replace("IFRAME_JS_PLACEHOLDER", iframeCode.slice(iframeCode.indexOf("*/") + 2))
        }
    }
})

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        basicSsl(),
        replaceIframeScript(iframeFilePath),
        watchModification([iframeFilePath, iframeRequestLinkerFilePath]),
    ],
    https: true,
    server: {
        port: 3000,
    },
})
