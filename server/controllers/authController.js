const axios = require('axios');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { findUserById, createUser, saveTokenToDB } = require('../services/userService');

// Função para iniciar o login com Blizzard Auth0
const battleNetLogin = (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    req.session.oauth_state = state;
    
    // Verifique o estado para depuração
    console.log('OAuth State:', req.session.oauth_state);

    // Armazene a URL de redirecionamento original na sessão
    req.session.redirect_url = req.query.redirect_url || '/';

    const redirectUri = `${config.BASE_URL}/api/auth/callback`;
    const authUrl = `https://battle.net/oauth/authorize?client_id=${config.BATTLE_NET_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid&state=${state}`;
    
    // Envie a URL de autorização para o frontend
    res.json({ authUrl });
};

// Função de callback para processar o código de autorização e autenticar o usuário
const callback = async (req, res) => {
    const { code, state } = req.query;

    // Verifique o estado para depuração
    console.log('Session OAuth State:', req.session.oauth_state);
    console.log('Query State:', state);

    if (!code) return res.status(400).send('Authorization code missing');
    if (state !== req.session.oauth_state) return res.status(400).send('State parameter mismatch');

    try {
        // Solicita um token de acesso usando o código de autorização
        const payload = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: `${config.BASE_URL}/api/auth/callback`,
            client_id: config.BATTLE_NET_CLIENT_ID,
            client_secret: config.BATTLE_NET_CLIENT_SECRET
        });

        const tokenResponse = await axios.post(config.OAUTH_TOKEN_URL, payload.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const { access_token } = tokenResponse.data;

        // Obtém informações do usuário usando o token de acesso
        const userInfoResponse = await axios.get(config.OAUTH_USERINFO_URL, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        const userInfo = userInfoResponse.data;

        const userId = userInfo.id;
        let existingUser = await findUserById(userId);

        if (!existingUser) {
            existingUser = await createUser(userInfo);
        }

        // Gera um JWT para o usuário autenticado
        const jwtToken = jwt.sign(userInfo, config.JWT_SECRET, { expiresIn: '1h' });
        await saveTokenToDB(userId, jwtToken);

        // Define o JWT como um cookie
        res.cookie('access_token', jwtToken, { httpOnly: true, secure: false });

        // Redireciona para a URL original ou para a página inicial
        const redirectUrl = req.session.redirect_url || '/';
        res.redirect(redirectUrl)
    } catch (error) {
        console.error('Failed to obtain user information:', error);
        res.status(500).send('Failed to obtain user information');
    }
};

const logout = (req, res) => {
    // Remove o cookie access_token
    res.cookie('access_token', '', { httpOnly: true, secure: false, expires: new Date(0) });

    // Retorna JSON com ok: true
    res.json({ ok: true });
};

module.exports = { battleNetLogin, callback, logout };
