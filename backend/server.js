const http = require('http');
const httpProxy = require('http-proxy');
const express = require('express');
const rateLimit = require('express-rate-limit');
const startServer = require('./app');

const numberOfServers = 4; 
const basePort = 3001;

const servers = [];

for (let i = 0; i < numberOfServers; i++) {
    const port = basePort + i;
    servers.push({ host: 'localhost', port });
    startServer(port); // Express servers
}

// Rate limiting settings
const uploadRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, //limit of 100 requests per 10 mins
  message: 'Too many requests, please try again later.'
});

const authRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: 'Too many authentication requests, please try again later.'
});

const routePools = {
    '/auth': [
      { host: 'localhost', port: 3001, weight: 1 },
      { host: 'localhost', port: 3002, weight: 1 },
    ],
    '/api/files/upload': [
      { host: 'localhost', port: 3003, weight: 3 },
      { host: 'localhost', port: 3004, weight: 2 },
    ],
    '/api/files/download': [
      { host: 'localhost', port: 3003, weight: 3 },
      { host: 'localhost', port: 3004, weight: 2 },
    ],
    '/api/files': [
      { host: 'localhost', port: 3003, weight: 1 },
      { host: 'localhost', port: 3004, weight: 1 },
    ],
};

const weightedTargets = {};
const routePointers = {};

for (const route in routePools) {
    weightedTargets[route] = [];
    routePools[route].forEach(server => {
      for (let i = 0; i < server.weight; i++) {
        weightedTargets[route].push(server);
      }
    });
    routePointers[route] = 0;
}

const proxy = httpProxy.createProxyServer();

const sortedRoutes = Object.keys(routePools).sort((a, b) => b.length - a.length);

const server = http.createServer((req, res) => {
    const matchedRoute = sortedRoutes.find(route => req.url.startsWith(route));

    if (!matchedRoute) {
      res.writeHead(502);
      return res.end('No matching route');
    }

    if (matchedRoute === '/auth/login' || matchedRoute === '/auth/signup') {
        authRateLimit(req, res, () => {
            handleProxyRequest(req, res, matchedRoute);
        });
    } else if (matchedRoute === '/api/files/upload' || matchedRoute === '/api/files/download') {
        uploadRateLimit(req, res, () => {
            handleProxyRequest(req, res, matchedRoute);
        });
    } else {
        handleProxyRequest(req, res, matchedRoute);
    }
});

function handleProxyRequest(req, res, matchedRoute) {
    const servers = weightedTargets[matchedRoute];
    const pointer = routePointers[matchedRoute];
    const target = servers[pointer];
    const targetUrl = `http://${target.host}:${target.port}`;

    console.log(`→ ${req.url} routed to ${targetUrl}`);
    proxy.web(req, res, { target: targetUrl });

    routePointers[matchedRoute] = (pointer + 1) % servers.length;
}

server.listen(5000, () => {
    console.log('Reverse proxy with weighted round-robin per route and rate limiting running on http://localhost:5000');
});
