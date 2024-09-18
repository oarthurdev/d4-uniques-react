// src/components/Loading.js
import React from 'react';
import './Loading.css'; // Importa o CSS para o componente de loading

const Loading = () => {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner"></div>
        </div>
    );
};

export default Loading;
