import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import Header from './components/Header';
import Footer from './components/Footer';
import ItemCard from './components/ItemCard';
import api from './axiosConfig';
import Loading from './components/Loading';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
    const [items, setItems] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [selectedNames, setSelectedNames] = useState([]);
    const [nameFilters, setNameFilters] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedClass, setSelectedClass] = useState('');
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchItems();
    }, [page]);

    useEffect(() => {
        fetchClasses();
        fetchFavorites();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/items/list', {
                params: {
                    search: nameFilters,
                    classFilter: selectedClass,
                    page,
                    pageSize: 6,
                }
            });
            setItems(response.data.items || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Erro ao buscar itens:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await api.get('/api/classes/list');
            setClasses(response.data || []);
        } catch (error) {
            console.error('Erro ao buscar classes:', error);
        }
    };

    const fetchFavorites = async () => {
        try {
            const response = await api.get('/api/favorites/list');
            const favoriteItems = response.data.favorites || [];
            setFavorites(new Set(favoriteItems.map(item => item.itemName.toLowerCase())));
        } catch (error) {
            console.error('Erro ao buscar favoritos:', error);
        }
    };

    const handleClassChange = (e) => {
        setSelectedClass(e.target.value);
    };

    const handleSearchChange = (selectedOptions) => {
        setSelectedNames(selectedOptions || []);
        const nameArray = selectedOptions.map(option => option.value);
        setNameFilters(nameArray);
    };

    const handleFavoriteToggle = async (itemName) => {
        try {
            const isFavorite = favorites.has(itemName.toLowerCase());
            const response = await api.post(`/api/favorite/${isFavorite ? 'remove' : 'add'}`, { item_name: itemName });
            if (response.data.success) {
                setFavorites(prev => {
                    const newFavorites = new Set(prev);
                    if (isFavorite) {
                        newFavorites.delete(itemName.toLowerCase());
                    } else {
                        newFavorites.add(itemName.toLowerCase());
                    }
                    return newFavorites;
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar favoritos:', error);
        }
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#2684FF' : '#ccc', // Cor da borda no foco
            boxShadow: state.isFocused ? '0 0 0 1px #2684FF' : null, // Sombra no foco
            '&:hover': {
                borderColor: '#2684FF', // Cor da borda ao passar o mouse
            },
            backgroundColor: '#f8f9fa', // Cor de fundo do input
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#2684FF', // Cor de fundo das tags de seleção
            borderRadius: '12px', // Bordas arredondadas
            padding: '2px 6px', // Espaçamento dentro das tags
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#fff', // Cor do texto nas tags
            fontWeight: 'bold', // Negrito para o texto
        }),
        multiValueRemove: (provided, state) => ({
            ...provided,
            color: '#fff', // Cor do ícone de remoção
            '&:hover': {
                backgroundColor: '#ff0033', // Cor de fundo ao passar o mouse
                color: '#fff', // Cor do ícone ao passar o mouse
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#2684FF' : '#fff', // Cor de fundo ao selecionar
            color: state.isSelected ? '#fff' : '#333', // Cor do texto ao selecionar ou não
            padding: '10px 20px', // Aumenta o espaçamento para melhor visualização
            '&:hover': {
                backgroundColor: '#e6f7ff', // Cor de fundo ao passar o mouse sobre uma opção
                color: '#000', // Cor do texto ao passar o mouse
            }
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#fff', // Cor de fundo do menu de opções
            zIndex: 999, // Garante que o menu de opções apareça corretamente em qualquer contexto
        }),
    };
    

    const handleModalOpen = (imageUrl, itemName) => {
        setModalImage(imageUrl);
        setModalTitle(itemName);
        setShowModal(true);
    };

    const handleModalClose = () => setShowModal(false);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchItems();
    };

    const handleSearchClick = () => {
        setPage(1); // Reseta a página ao fazer uma nova busca
        fetchItems();
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {loading && <Loading />}
            <Header userInfo={userInfo} onLogout={() => {}} onLogin={() => {}} className="header" />

            <Container className="my-5 pt-5">
                <div className="sticky-header">
                    <Row>
                        <Col md="6">
                            <Select
                                isMulti
                                placeholder="Digite e selecione nomes..."
                                value={selectedNames}
                                onChange={handleSearchChange}
                                options={items.map(item => ({ value: item.name, label: item.name }))}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                styles={customStyles}
                            />
                        </Col>
                        <Col md="4">
                            <Form.Control as="select" onChange={handleClassChange} value={selectedClass}>
                                <option value="">Todas as Classes</option>
                                {classes.map(cls => (
                                    <option key={cls} value={cls}>{capitalizeFirstLetter(cls)}</option>
                                ))}
                            </Form.Control>
                        </Col>
                        <Col md="2" className="text-center">
                            <Button variant="primary" onClick={handleSearchClick}>Pesquisar</Button>
                        </Col>
                    </Row>
                </div>
                <Row>
                    {items.length > 0 ? items.map(item => (
                        <Col md={4} key={item.name} className="mb-4">
                            <ItemCard
                                item={{ ...item, class: capitalizeFirstLetter(item.class || '') }}
                                isFavorite={favorites.has(item.name.toLowerCase())}
                                onFavoriteToggle={handleFavoriteToggle}
                                onImageClick={handleModalOpen}
                            />
                        </Col>
                    )) : (
                        <Col md={12} className="text-center">
                            <p>Nenhum item encontrado.</p>
                        </Col>
                    )}
                </Row>
                <Row>
                    <Col className="text-center">
                        <Button
                            variant="secondary"
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                        >
                            Anterior
                        </Button>
                        <span className="mx-2">Página {page} de {totalPages}</span>
                        <Button
                            variant="secondary"
                            disabled={page === totalPages}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            Próxima
                        </Button>
                    </Col>
                </Row>
            </Container>

            <Footer />

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center">
                    <img 
                        src={modalImage} 
                        alt={modalTitle} 
                        className="img-fluid" 
                        style={{ maxWidth: '100%', maxHeight: '400px' }} 
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default App;
