import React from "react";

const EmotionKeywords = ({ keywords }) => {
    return (
      <div className="emotion-keywords-container">
        <h3>감정 키워드</h3>
        <ul>
          {keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>
    );
  };

export default EmotionKeywords;