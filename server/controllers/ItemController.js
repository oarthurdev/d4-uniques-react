const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const config = require('../config');

// Função para buscar dados com retry
const fetchDataWithRetry = async (url, retries = 3, delay = 1000) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        if (retries === 0) throw error;
        await new Promise(res => setTimeout(res, delay));
        return fetchDataWithRetry(url, retries - 1, delay);
    }
};

const updateLocalData = async (req, res) => {
    try {
        const codexData = await fetchDataWithRetry(config.CODDEX_API_URL);
        const uniquesData = await fetchDataWithRetry(config.UNIQUES_API_URL);

        // Mapeia os dados do codex
        const codexNameToItem = {};
        if (codexData) {
            codexData.forEach(item => {
                const label = item.label.toLowerCase();
                codexNameToItem[label] = {
                    class: item.class === "generic" ? "Unknown" : item.class,
                    description: item.description || 'Descrição não disponível',
                    image_url: item.image_url || config.PLACEHOLDER_IMAGE_URL
                };
            });
        }

        // Buscar itens existentes para evitar duplicações
        const existingItems = await prisma.item.findMany();
        const existingItemsMap = new Map(existingItems.map(item => [item.name.toLowerCase(), item]));

        const updatedData = [];
        const newItems = [];

        // Atualizar dados a partir de uniquesData
        uniquesData.forEach(uniquesItem => {
            const label = uniquesItem.name.toLowerCase();
            const itemType = uniquesItem.mythic ? 'Mythic' : 'Unique';

            // Se o item já existe, atualize-o
            if (existingItemsMap.has(label)) {
                const existingItem = existingItemsMap.get(label);

                // Verifica se o nome do item no uniquesData é igual ao nome no codexData
                const codexItem = codexNameToItem[label] || {};
                const updatedDescription = codexItem.description || uniquesItem.description;

                updatedData.push({
                    where: { id: existingItem.id },
                    data: {
                        type: itemType,
                        class: uniquesItem.class || existingItem.class, // Usa a classe do codex se disponível, caso contrário usa a do uniques
                        description: updatedDescription,
                        image_url: uniquesItem.image_url || existingItem.image_url
                    }
                });
            } else {
                // Se o item não existe, adicione-o à lista de novos itens
                const codexItem = codexNameToItem[label] || {};
                newItems.push({
                    type: itemType,
                    name: uniquesItem.name,
                    class: uniquesItem.class || 'Unknown',
                    description: codexItem.description || 'No description available',
                    image_url: uniquesItem.image_url || config.PLACEHOLDER_IMAGE_URL
                });
            }
        });

        // Atualizar itens existentes no banco de dados
        if (updatedData.length > 0) {
            await Promise.all(updatedData.map(async item => {
                if (item.data.class === "generic") {
                    item.data.class = "Unknown";
                }

                await prisma.item.update(item);
            }));
        }

        // Inserir novos itens no banco de dados
        if (newItems.length > 0) {
            await prisma.item.createMany({
                data: newItems
            });
        }

        res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Error updating data' });
    }
};

// Função para buscar itens com base em filtros
const getItems = async (req, res) => {
    try {
        const { search = [], classFilter = '', page = 1, pageSize = 6 } = req.query;

        // Validação e normalização dos parâmetros de página
        const pageNumber = parseInt(page, 6) > 0 ? parseInt(page, 6) : 1;
        const pageSizeNumber = parseInt(pageSize, 6) > 0 ? parseInt(pageSize, 6) : 6;
        const skip = (pageNumber - 1) * pageSizeNumber;

        // Criação da consulta com filtros
        const filters = {};

        // Verifica se search é um array e tem valores
        if (Array.isArray(search) && search.length > 0) {
            filters.name = { in: search.map(item => item.trim()), mode: 'insensitive' }; // Usa operador "in" para buscar vários nomes
        } else if (typeof search === 'string' && search.trim() !== '') {
            filters.name = { contains: search.trim(), mode: 'insensitive' }; // Fallback para buscar por string única
        }

        if (classFilter) {
            filters.class = { equals: classFilter, mode: 'insensitive' };
        }

        // Consultar o total de itens para a paginação
        const totalItems = await prisma.item.count({
            where: filters
        });

        // Consultar os itens da página atual
        const items = await prisma.item.findMany({
            where: filters,
            orderBy: { name: 'asc' },
            skip,
            take: pageSizeNumber
        });

        const totalPages = Math.ceil(totalItems / pageSizeNumber);

        res.status(200).json({
            items,
            totalPages,
            currentPage: pageNumber,
            totalItems
        });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Error fetching items' });
    }
};

// Função para buscar itens com base em filtros
const getNameItems = async (req, res) => {
    try {
        // Consultar os nomes de todos os itens
        const items = await prisma.item.findMany({
            select: {
                name: true
            },
            orderBy: { name: 'asc' }
        });

        res.status(200).json({
            items
        });
        
    } catch (error) {
        console.error('Error fetching name items:', error);
        res.status(500).json({ error: 'Error fetching name items' });
    }
};


module.exports = { updateLocalData, getItems, getNameItems };
