const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para criar um novo usuário
const listClass = async (req, res) => {
    try {
        const items = await prisma.item.findMany({
            distinct: ['class'], // Encontra apenas valores distintos
            select: {
                class: true
            }
        });

        // Extrai e retorna as classes distintas
        const classes = items.map(item => item.class).filter(Boolean); // Filtra valores falsy, como null ou undefined
        res.status(200).json(classes);
    } catch (error) {
        console.error('Erro ao buscar classes:', error);
        res.status(500).json({ error: 'Erro ao buscar classes' });
    }
};

module.exports = { listClass };
