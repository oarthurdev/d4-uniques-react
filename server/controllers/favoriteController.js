// controllers/favoriteController.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { findUserById } = require('../services/userService');
const prisma = new PrismaClient();

// Obtém a lista de favoritos do usuário
const getFavorites = async (req, res) => {
    const userId = req.user.id;

    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            select: { itemName: true },
        });

        return res.status(200).json({ favorites: favorites.map(fav => ({ itemName: fav.itemName })) });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};


const addFavorite = async (req, res) => {
    const userId = req.user.id; // Supondo que você decodifica o usuário no middleware
    const { item_name } = req.body;

    if (!item_name) {
        return res.status(400).json({ error: 'Item name is required', success: false });
    }

    try {
        // Verifique se o usuário existe
        const user = await findUserById(userId)

        if (!user) {
            return res.status(404).json({ error: 'User not found', success: false });
        }

        // Verifica se o favorito já existe
        const existingFavorite = await prisma.favorite.findUnique({
            where: { 
                userId_itemName: { 
                    userId, 
                    itemName: item_name 
                } 
            }
        });

        if (!existingFavorite) {
            // Adiciona novo favorito
            await prisma.favorite.create({
                data: { 
                    userId, 
                    itemName: item_name 
                }
            });
        }

        return res.status(200).json({ status: 'Favorite added successfully', success: true });
    } catch (error) {
        console.error('Error adding favorite:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};


const removeFavorite = async (req, res) => {
    const userId = req.user.id; // Supondo que você decodifica o usuário no middleware
    const { item_name } = req.body;

    if (!item_name) {
        return res.status(400).json({ error: 'Item name is required', success: false });
    }

    try {
        // Encontra o favorito para remover
        const favorite = await prisma.favorite.findUnique({
            where: { userId_itemName: { userId, itemName: item_name } }
        });

        if (favorite) {
            await prisma.favorite.delete({
                where: { userId_itemName: { userId, itemName: item_name } }
            });
        }

        return res.status(200).json({ status: 'Favorite removed successfully', success: true });
    } catch (error) {
        console.error('Error removing favorite:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};

module.exports = { addFavorite, removeFavorite, getFavorites };
