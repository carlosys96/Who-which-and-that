
import React from 'react';

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseClasses = 'px-6 py-3 font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 focus:ring-cyan-400',
    secondary: 'bg-slate-600 text-white hover:bg-slate-500 focus:ring-slate-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;