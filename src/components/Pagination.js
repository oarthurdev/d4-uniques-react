// src/components/Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const createPageItem = (page, isActive, isDisabled, label) => (
        <li key={page} className={`page-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
            <a className="page-link" href="#" onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
            }}>
                {label}
            </a>
        </li>
    );

    const pageRange = 5;
    let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
    let endPage = Math.min(totalPages, currentPage + Math.floor(pageRange / 2));

    if (currentPage - Math.floor(pageRange / 2) <= 1) {
        endPage = Math.min(totalPages, pageRange);
    }
    if (currentPage + Math.floor(pageRange / 2) >= totalPages) {
        startPage = Math.max(1, totalPages - pageRange + 1);
    }

    return (
        <nav>
            <ul className="pagination">
                {createPageItem(1, currentPage === 1, currentPage === 1, 'First')}
                {createPageItem('Previous', currentPage === 1, currentPage === 1)}
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page =>
                    createPageItem(page, page === currentPage)
                )}
                {createPageItem('Next', currentPage === totalPages, currentPage === totalPages)}
                {createPageItem(totalPages, currentPage === totalPages, currentPage === totalPages, 'Last')}
            </ul>
        </nav>
    );
};

export default Pagination;
