// src/components/Header.js
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import api from '../axiosConfig';

const Header = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Função para buscar informações do usuário
        const fetchUserInfo = async () => {
            try {
                const response = await api.get('/api/user/info');
                if (response.data && response.data.battletag) {
                    setUserInfo({ battletag: response.data.battletag });
                }
            } catch (error) {
                console.error('Failed to fetch user information:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const onLogout = async () => {
        const response = await api.get('/api/auth/logout');
        const { ok } = response.data;
        if (ok) {
            window.location.href = "/";
        } else {
            console.error('Logout error');
        }
    }

    const handleLogin = async () => {
        try {
            const response = await api.get('/api/auth/login', { params: { redirect_url: window.location.pathname } });
            const { authUrl } = response.data;
            if (authUrl) {
                window.location.href = authUrl;
            } else {
                console.error('Auth URL not found');
            }
        } catch (error) {
            console.error('Failed to start login process:', error);
        }
    };

    return (
        <Navbar bg="dark" variant="dark" fixed="top">
            <Container>
                <Navbar.Brand>Diablo IV - Unique Items</Navbar.Brand>
                <Nav className="ml-auto">
                    {userInfo ? (
                        <>
                            <Navbar.Text className="text-light mr-3">{userInfo.battletag}</Navbar.Text>
                            <Button variant="danger" onClick={onLogout} className="logout-button">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5l-5-5m5 5H9"/></svg>
                            </Button>
                        </>
                    ) : (
                        <Button variant="primary" onClick={handleLogin} className="login-button">
                            <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 580.4" className="login-icon">
                                <path fill="#fff" d="M473.5 197.6c-75.9-35.1-185.1-57.4-287.8-49.1 5.1-34 17.9-57.7 38.7-62.7 28.7-6.9 60 12 89.8 46.3 19.5 2.5 42.7 7 58.9 10.7C318.7 40.5 245.7-16.8 190.2 4.4 148 20.5 126.4 78.6 129 156.7c-55 11.7-97.9 32.5-125.4 62.4-1.4 1.6-4.5 5.7-3.4 7.6.9 1.5 3.6-.2 4.9-1 31.8-22.3 72.6-34.3 125.7-41.9 7.6 83.3 42.8 189 101.4 273.8-32 12.6-58.9 13.4-73.6-2.2-20.3-21.4-19.6-58-4.8-101-7.6-18.2-15.3-40.5-20.1-56.3-61.6 98.3-74.8 190.2-28.7 227.7 35.1 28.5 96.2 18.2 162.5-23.1 37.6 41.8 77.1 68.5 116.7 77.3 2.1.4 7.2 1.1 8.3-.8.9-1.5-2-3.1-3.3-3.7-35.2-16.4-66-45.7-99.1-87.9 68.4-48.2 142.3-131.6 186.4-224.7 26.9 21.5 41 44.3 34.9 64.9-8.4 28.3-40.4 46-85.1 54.6-12 15.7-27.4 33.5-38.7 45.6 115.8 4 202-30.5 211.4-89.1 7.2-44.6-32.4-92.4-101.3-129.2 17.4-53.5 20.8-101 8.6-139.7-.7-2-2.6-6.8-4.9-6.8-1.7 0-1.7 3.3-1.6 4.7 3.6 38.6-6.3 80-26.3 129.7zM260.2 444.3c-49-78.6-77.2-171.2-77.1-264.8 92.6-3.1 186.9 18.7 267.9 65.7-43.6 81.7-109.6 152.5-190.8 199.1z"/>
                            </svg>
                            <span className="login-text">Login</span>
                        </Button>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;
