// Title.jsx
import React from 'react';

const Title = ({ text1, text2, customTextColor }) => {
  const textColor = customTextColor || 'text-black'; // Default to black if not provided
  
  return (
    <h2 className={`text-3xl ${textColor}`}>
      {text1} <span className="font-light">{text2}</span>
    </h2>
  );
};

export default Title;