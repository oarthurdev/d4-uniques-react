const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const itemRoutes = require('./routes/ItemRoutes');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(cors({
    origin: '*', // ou especifique seu domínio frontend em produção
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Sessão
const sessionConfig = {
    id: "1",
    secret: "1234",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 30,
        sameSite: true,
        secure: false, // Ajuste para true em produção com HTTPS
        httpOnly: true
    }
};
app.use(session(sessionConfig));

// Rotas da API
app.use('/api', itemRoutes);

// Depois de configurar as rotas da API, sirva os arquivos estáticos do React
app.use(express.static(path.join(__dirname, 'client/build')));

// Fallback para servir o frontend React em todas as outras rotas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

module.exports = app;
