const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require("fs");
const https = require('https');
const path = require('path');

// Creating express server
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

app.use(morgan('dev'));
app.use(cors());

// SSL certificate and private key
const SSL_CERTIFICATE_PATH = process.env.SSL_CERTIFICATE_PATH || path.resolve(__dirname, 'cert', 'fullchain.pem');
const SSL_PRIVATE_KEY_PATH = process.env.SSL_PRIVATE_KEY_PATH || path.resolve(__dirname, 'cert', 'privkey.pem');

const sslOptions = {
    cert: fs.readFileSync(SSL_CERTIFICATE_PATH),
    key: fs.readFileSync(SSL_PRIVATE_KEY_PATH)
};

// Proxy endpoints
app.use('/proxy', createProxyMiddleware({
    target: '',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        const targetUrl = req.query.url;
        console.log("redirected to", targetUrl);
        console.log(req.method);

        proxyReq.method = req.method;
        proxyReq.path = targetUrl;

        proxyReq.setHeader("origin", "https://www.ecoledirecte.com");
        proxyReq.setHeader("referer", "https://www.ecoledirecte.com/");
        proxyReq.setHeader("x-forwarded-server", "api.ecoledirecte.com");
        proxyReq.setHeader("x-forwarded-host", "api.ecoledirecte.com");
        proxyReq.setHeader("x-forwarded-for", "56.15.23.89");
        proxyReq.setHeader("host", new URL(targetUrl).host);
    },
    onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
    }
}));

const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(PORT, HOST, () => {
    console.log(`Starting HTTPS Proxy at ${HOST}:${PORT}`);
});
