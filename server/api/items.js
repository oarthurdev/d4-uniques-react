const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const itemRoutes = require('../routes/ItemRoutes');

const app = express();

// Middleware
const sessionConfig = {
    id: "1",
    secret: "1234",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 30,
        sameSite: true,
        secure: false, // Ajustar para true em conexões HTTPS
        httpOnly: true
    }
};

app.use(session(sessionConfig));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(bodyParser.json());

const corsOptions = {
    origin: '*', // Ajustar para o domínio do frontend em produção
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

// API Routes
app.use('/api', itemRoutes);

// Handler para exportar a função serverless
module.exports = (req, res) => {
    return new Promise((resolve, reject) => {
        app(req, res, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
