const express = require('express');
const path = require('path');

const server = express();

// Servir os arquivos estáticos do frontend React (build)
server.use(express.static(path.join(__dirname, '../server/client/build')));

// Fallback para servir o React em todas as rotas que não começarem com /api
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../server/client/build', 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
  server.listen(process.env.PORT, () => {
      console.log('Servidor rodando na porta ', process.env.PORT);
  });
}

module.exports = server;
