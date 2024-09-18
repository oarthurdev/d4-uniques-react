const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const itemRoutes = require('./routes/ItemRoutes');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

const sessionConfig = {
    id: "1",
    secret: "1234",
    resave: false,
    saveUninitialized: false,
    cookie: {
    maxAge: 1000 * 60 * 30,
    sameSite: true,
    secure: false, // ajustar para false em conexoes HTTP
    sameSite: true,
    httpOnly: true
    }
};

app.use(session(sessionConfig));

app.use(cookieParser(process.env.SESSION_SECRET));
// Configure bodyParser and other middleware
app.use(bodyParser.json());

// Configure CORS
const corsOptions = {
    origin: '*', // Replace with your frontend domain in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allows cookies and authorization headers
};

// Servir o frontend React
app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});


app.use(cors(corsOptions));
// Routes
app.use('/api', itemRoutes);
