// src/components/ItemCard.js
import React from 'react';
import { Card } from 'react-bootstrap';
import { FaStar, FaRegStar } from 'react-icons/fa'; // Importa ícones de estrela
import './ItemCard.css'; // Certifique-se de criar este arquivo CSS

const ItemCard = ({ item, isFavorite, onFavoriteToggle }) => {
    const cardClass = `item-card ${item.type === 'Mythic' ? 'mythic-border' : ''}`;
    return (
        <Card className={cardClass} style={{ height: '500px' }}>
            <div className="item-card-header">
                <div 
                    className={`favorite-icon ${isFavorite ? 'favorite' : ''}`} 
                    onClick={() => onFavoriteToggle(item.name)}
                >
                    {isFavorite ? <FaStar /> : <FaRegStar />}
                </div>
            </div>
            <div className="item-card-image-wrapper">
                <Card.Img 
                    variant="top" 
                    src={item.image_url} 
                    className="item-card-image" 
                    alt={item.name} 
                />
            </div>
            <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                    <strong>Type:</strong> {item.type}<br />
                    <strong>Class:</strong> {item.class}<br />
                    <strong>Description:</strong> {item.description}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default ItemCard;
