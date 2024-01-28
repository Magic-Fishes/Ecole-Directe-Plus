const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require("fs");
const https = require('https');

// Creating express server
const app = express();

const PORT = 3000;
const HOST = "localhost";

app.use(morgan('dev'));
app.use(cors());

// SSL certificate and private key
const SSL_CERTIFICATE_PATH = "[FULLKEY_PEM]";
const SSL_PRIVATE_KEY_PATH = "[PRIVKEY_PEM]";

const sslOptions = {
	cert: fs.readFileSync(SSL_CERTIFICATE_PATH),
	key: fs.readFileSync(SSL_PRIVATE_KEY_PATH)
};


// Proxy endpoints
app.all('/proxy', (req, res, next) => {
	createProxyMiddleware(
		{
			target: req.query.url,
			onProxyReq: (proxyReq, req, res) => {
				console.log("redirected to", req.query.url)
				console.log(req.method);
				proxyReq.method = req.method;
				proxyReq.path = req.query.url;

				proxyReq.setHeader("origin", "https://www.ecoledirecte.com");
				proxyReq.setHeader("referer", "https://www.ecoledirecte.com/");
				proxyReq.setHeader("x-forwarded-server", "api.ecoledirecte.com");
				proxyReq.setHeader("x-forwarded-host", "api.ecoledirecte.com");
				proxyReq.setHeader("x-forwarded-for", "56.15.23.89");
				proxyReq.setHeader("host", new URL(req.query.url).host);
			},
			onError: (err, req, res) => {
				console.error('Proxy error:', err);
				res.status(500).send('Proxy error');
			},
			changeOrigin: true,
		})(req, res, next);
});


const httpsServer = https.createServer(sslOptions, app);

httpsServer.listen(PORT, HOST, () => {
	console.log(`Starting HTTPS Proxy at ${HOST}:${PORT}`);
});
