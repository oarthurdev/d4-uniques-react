const express = require('express');
const path = require('path');
const app = require('./server/app'); // Importando as rotas e lógica do app.js (backend)

const server = express();

// Servir os arquivos estáticos do frontend React (build)
server.use(express.static(path.join(__dirname, 'server/client/build')));

// Fallback para servir o React em todas as rotas que não começarem com /api
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'server/client/build', 'index.html'));
});

module.exports = server;
