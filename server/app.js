const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const itemRoutes = require('./routes/ItemRoutes');
const app = express();

// Middleware
const sessionConfig = {
    store: new (require('connect-pg-simple')(session))({
        conString: process.env.SQLALCHEMY_DATABASE_URI
    }),
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

// Rota para servir o frontend no modo de produção
app.use(express.static(path.join(__dirname, 'client/build')));

// Rota de fallback para o frontend React
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

module.exports = app;
