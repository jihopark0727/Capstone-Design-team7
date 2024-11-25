import React, { useState } from 'react';
import './SearchBar.css';
import searchBackground from '../assets/search-background.svg'; // SVG 파일

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className="search-bar-container">
            {/* SVG 배경 */}
            <div className="search-bar-background">
                <img src={searchBackground} alt="Search Background" className="background-svg" />

                {/* 검색 입력창과 버튼 */}
                <form className="search-bar-form" onSubmit={handleSubmit}>
                    {/* 돋보기 버튼 */}
                    <button type="submit" className="icon-button">
                        
                    </button>
                    {/* 검색 입력창 */}
                    <input
                        type="text"
                        placeholder="내담자 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
            </div>
        </div>
    );
}

export default SearchBar;
