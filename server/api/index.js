const app = require('../app'); // Importa o app Express do seu arquivo app.js

module.exports = (req, res) => {
  app(req, res); // O Vercel trata cada chamada como uma função serverless
};