// src/__tests__/App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import axios from 'axios';

// Mock do módulo axios
jest.mock('axios');

describe('App Component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({
            data: {
                items: [
                    { name: 'Sword of Destiny', type: 'Legendary', class: 'Warrior', power: 300, image_url: '/images/sword.jpg' },
                    { name: 'Shield of Valor', type: 'Epic', class: 'Paladin', power: 150, image_url: '/images/shield.jpg' }
                ],
                total_pages: 1
            }
        });
    });

    it('renders the header correctly', () => {
        render(<App />);
        expect(screen.getByText(/Diablo IV - Unique Items/i)).toBeInTheDocument();
    });

    it('renders items correctly', async () => {
        render(<App />);
        const itemNames = await screen.findAllByText(/Sword of Destiny|Shield of Valor/i);
        expect(itemNames).toHaveLength(2);
    });

    it('opens and closes the modal correctly', async () => {
        render(<App />);
        const itemImage = screen.getByAltText(/Sword of Destiny/i);
        fireEvent.click(itemImage);
        expect(screen.getByText(/Sword of Destiny/i)).toBeInTheDocument();
        const closeButton = screen.getByRole('button', { name: /Close/i });
        fireEvent.click(closeButton);
        expect(screen.queryByText(/Sword of Destiny/i)).not.toBeInTheDocument();
    });
});
