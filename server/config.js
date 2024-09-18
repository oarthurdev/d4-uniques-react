require('dotenv').config();

const config = {
    JWT_SECRET: process.env.JWT_SECRET || 'your-default-secret-key',
    ALG_JWT: 'HS256',
    SQLALCHEMY_DATABASE_URI: process.env.SQLALCHEMY_DATABASE_URI || 'postgresql://localhost:5432/uniques-d4',
    PERMANENT_SESSION_LIFETIME: 30 * 60 * 1000, // 30 minutos em milissegundos
    PLACEHOLDER_IMAGE_URL: 'https://via.placeholder.com/200x200',
    BASE_URL: 'http://localhost:5000',
    CODDEX_API_URL: 'https://d4api.dev/api/codex',
    UNIQUES_API_URL: 'https://d4api.dev/api/uniques',
    BATTLE_NET_CLIENT_ID: process.env.BATTLE_NET_CLIENT_ID || 'your-client-id',
    BATTLE_NET_CLIENT_SECRET: process.env.BATTLE_NET_CLIENT_SECRET || 'your-client-secret',
    OAUTH_TOKEN_URL: 'https://oauth.battle.net/token',
    OAUTH_USERINFO_URL: 'https://oauth.battle.net/userinfo'
};

module.exports = config;
