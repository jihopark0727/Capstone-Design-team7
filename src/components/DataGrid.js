import React from 'react';

const DataGrid = () => {
  const clientData = {
    인적사항: {
      성명: '홍길동',
      연락처: '010-1234-5678',
      생년월일: '1990-01-01',
      성별: '남',
      직업: '회사원'
    },
    상담개요: {
      상담주제: '결혼',
      '주 호소문제': '의사소통 문제',
      '최근 상담일': '2023-05-15',
      '다음 예약일': '2023-05-22'
    }
  };

  return (
    <div className="data-grid">
      {Object.entries(clientData).map(([category, data], index) => (
        <div key={category} className={`grid-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
          <h3>{category}</h3>
          <div className="grid-content">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="grid-item">
                <span className="item-key">{key}:</span>
                <span className="item-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataGrid;