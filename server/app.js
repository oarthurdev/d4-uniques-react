const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const itemRoutes = require('./routes/ItemRoutes');
const path = require('path');
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

// API Routes (deve vir antes do middleware de arquivos estáticos)
app.use('/api', itemRoutes);

// Serve React build files
app.use(express.static(path.join(__dirname, 'client/build')));

// Fallback route to serve the React app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

module.exports = app;
