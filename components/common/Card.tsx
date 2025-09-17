
import React from 'react';

// FIX: Update CardProps to accept standard div attributes (like onClick) and pass them to the underlying div.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 p-6 sm:p-10 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
