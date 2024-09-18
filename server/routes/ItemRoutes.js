const express = require('express');
const { updateLocalData, getItems } = require('../controllers/ItemController');
const { listClass } = require('../controllers/ClassController');
const { battleNetLogin, callback, logout } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const { userInformation } = require('../controllers/userController');
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');
const router = express.Router();

// Rota para atualizar os itens
router.get('/items/update', updateLocalData);

// Rota para buscar itens com base em filtros
router.get('/items/list', getItems);

router.get('/classes/list', listClass);

router.get('/auth/login', battleNetLogin);
router.get('/auth/logout', authenticateToken, logout);
router.get('/auth/callback', callback);
router.get('/user/info', authenticateToken, userInformation)

router.post('/favorite/add', authenticateToken, addFavorite);

// Rota para remover favorito
router.post('/favorite/remove', authenticateToken, removeFavorite);

router.get('/favorites/list', authenticateToken, getFavorites);

module.exports = router;
