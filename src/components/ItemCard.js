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
                <Card.Title><span style={{
                        color: item.type === 'Mythic' ? 'purple' : 'black'
                        }}>
                        {item.name}
                        </span><br /></Card.Title>
                <Card.Text>
                    <strong>Type: </strong> 
                        <span style={{
                        color: item.type === 'Mythic' ? 'purple' : 'black',
                        fontWeight: item.type === 'Mythic' ? 'bold' : 'normal',
                        textShadow: item.type === 'Mythic' ? '1px 1px 5px rgba(128, 0, 128, 0.7)' : 'none'
                        }}>
                        {item.type}
                        </span><br />
                    <strong>Class:</strong> {item.class}<br />
                    <strong>Description:</strong> {item.description}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default ItemCard;
