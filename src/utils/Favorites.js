import axios from 'axios';

// Função para alternar o status de favorito de um item
export const toggleFavorite = async (itemName, isFavorite) => {
    const url = isFavorite ? '/api/favorites/remove_favorite' : '/api/favorites/add_favorite';
    try {
        const response = await axios.post(url, { itemName });
        return response.data; // Espera-se que a resposta contenha informações sobre o estado do favorito
    } catch (error) {
        console.error('Error toggling favorite:', error);
        throw error; // Lançar erro para que quem chamar a função possa lidar com ele
    }
};
