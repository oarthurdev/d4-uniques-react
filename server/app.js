const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const itemRoutes = require('./routes/ItemRoutes');
const path = require('path');
const app = express();

// Middleware para parsear cookies
app.use(cookieParser(process.env.SESSION_SECRET));

// Middleware para configurar CORS
const corsOptions = {
    origin: '*', // Substitua pelo domínio do frontend em produção
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Permite cookies e headers de autorização
};
app.use(cors(corsOptions));

// Middleware para parsear o corpo das requisições
app.use(bodyParser.json());

// Middleware para sessões
const sessionConfig = {
    id: "1",
    secret: "1234",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 30,
        sameSite: true,
        secure: false,
        httpOnly: true
    }
};
app.use(session(sessionConfig));

// Rotas da API
app.use('/api', itemRoutes);

// Servir o frontend React apenas para a rota "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Servir os arquivos estáticos para todas as outras rotas
app.use(express.static(path.join(__dirname, 'client/build')));

module.exports = app;
