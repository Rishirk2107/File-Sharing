const http = require('http');
const httpProxy = require('http-proxy');
const startServer = require('./app'); // Assuming server.js is in the same directory

const numberOfServers = 4; // You can change this to any number
const basePort = 3001;

const servers = [];

for (let i = 0; i < numberOfServers; i++) {
    const port = basePort + i;
    servers.push({ host: 'localhost', port });
    startServer(port); // Launch each Express server
}

let current = 0;
const proxy = httpProxy.createProxyServer();

const server = http.createServer((req, res) => {
    const target = servers[current];
    console.log(`🔁 Forwarding request to: http://${target.host}:${target.port}`);

    proxy.web(req, res, { target: `http://${target.host}:${target.port}` });

    current = (current + 1) % servers.length;
});

server.listen(5000, () => {
    console.log('🚦 Load balancer listening on http://localhost:5000');
});
