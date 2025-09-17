
import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 p-6 sm:p-10 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;