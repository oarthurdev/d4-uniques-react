const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para criar um novo usuário
const createUser = async (userData) => {
  try {
    const user = await prisma.user.create({
      data: {
        id: userData.id,
        battletag: userData.battletag, // Assumindo que userData.data é um objeto JSON
        jwtToken: userData.jwtToken
      }
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

const userInformation = async (req, res) => {
  try {
      const userId = req.user.id;

      // Encontre o usuário no banco de dados
      const user = await prisma.User.findUnique({
          where: { id: userId }
      })

      if (!user) return res.status(404).json({ message: 'User not found' });

      
      // Extrair a battletag do campo data
      const data = user;
      const battletag = data.battletag;

      // Retornar a battletag para o cliente
      res.json({ battletag });
  } catch (error) {
      console.error('Error retrieving battletag:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { createUser, userInformation };
