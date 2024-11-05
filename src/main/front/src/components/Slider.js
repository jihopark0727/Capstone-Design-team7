import React, { useState, useEffect } from 'react';

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { 
      title: "기능 1: 상담사 매칭", 
      content: "상담사 매칭 내용", 
      imageUrl: "https://happypop.kr/wp-content/uploads/2022/09/%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8-1.png"  // 이미지 URL 추가
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
    <div className="slider">
      <div className="slide">
        <h2>{slides[currentSlide].title}</h2>
        <p>{slides[currentSlide].content}</p>
        {/* 이미지 출력 */}
        <img 
          src={slides[currentSlide].imageUrl} 
          alt={slides[currentSlide].title} 
          className="slider-image"
        />
      </div>
      <div className="pagination">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}  // 클릭 이벤트로 슬라이드 이동
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
