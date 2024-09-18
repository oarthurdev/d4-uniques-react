export const isAuthenticated = () => {
    // Verifica se o cookie do token JWT existe
    return document.cookie.includes('access_token');
};
