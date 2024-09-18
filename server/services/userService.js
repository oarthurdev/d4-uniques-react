const prisma = require('../config/db');

const findUserById = async (userId) => {
    // Implementar a lógica para encontrar o usuário no banco de dados
    return prisma.User.findUnique({
        where: { id: userId }
      })
};

const createUser = async (userData) => {
    console.log(userData)
    // Implementar a lógica para criar um novo usuário no banco de dados
    return prisma.User.create({
        data: {
            id: userData.id,
            battletag: userData.battletag
        }
    });
};

const saveTokenToDB = async (userId, token) => {
    try {
        // Encontre o usuário com base no ID extraído do campo `data`
        const user = await prisma.User.findUnique({
            where: { id: userId }
          })

        if (!user) {
            throw new Error('User not found');
        }

        // Atualize o token JWT do usuário encontrado
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { jwtToken: token },
        });

        return updatedUser;
    } catch (error) {
        console.error('Error updating user token:', error);
        throw new Error('Unable to update token');
    }
};

module.exports = { findUserById, createUser, saveTokenToDB };
