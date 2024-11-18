import React, { useState, useEffect } from 'react';
import './Slider.css'; // 새로 만든 스타일 파일 연결

function Slider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        { 
            title: "기능 1: 상담사 매칭", 
            content: "상담사 매칭 내용", 
            imageUrl: "/path/to/image2.jpg" 
        },
        { 
            title: "기능 2: 실시간 채팅", 
            content: "실시간 채팅 내용", 
            imageUrl: "/path/to/image2.jpg" 
        },
        { 
            title: "기능 3: 화상 상담", 
            content: "화상 상담 내용", 
            imageUrl: "/path/to/image3.jpg" 
        },
        { 
            title: "기능 4: 상담 일정 관리", 
            content: "상담 일정 관리 내용", 
            imageUrl: "/path/to/image4.jpg" 
        },
        { 
            title: "기능 5: 상담 후기", 
            content: "상담 후기 내용", 
            imageUrl: "/path/to/image5.jpg" 
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="swiper">
            <div className="title">
                <div className="text-">
                    {slides[currentSlide].title}
                </div>
                <div className="text--">
                    {slides[currentSlide].content}
                </div>
            </div>
            <div className="image">
                <div className="imagecenter">
                    <div className="content-title-image1">
                        <img 
                            src={slides[currentSlide].imageUrl} 
                            alt={slides[currentSlide].title} 
                            className="image-1"
                        />
                    </div>
                </div>
            </div>
            <div className="pagination">
                {slides.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => handleDotClick(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Slider;
