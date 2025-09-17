
import React from 'react';
import Card from './Card';

const Loader = ({ message = "Loading..." }) => {
  return (
    <Card className="flex flex-col items-center justify-center text-center gap-6 p-12">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
      <p className="text-xl text-slate-300">{message}</p>
    </Card>
  );
};

export default Loader;