
'use client';

import { useState } from 'react';

interface SliderProps {
  option1: string;
  option2: string;
  onToggle?: (isOption2: boolean) => void;
  isLoading: boolean;
}

export default function Slider({ option1, option2, onToggle, isLoading }: SliderProps) {
  const [isOption2, setIsOption2] = useState(false);

  const handleToggle = () => {
    if (isLoading) return;
  
    const newValue = !isOption2;
    setIsOption2(newValue);
    onToggle?.(newValue);
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`${!isOption2 ? 'font-bold' : 'text-gray-500'}`}>
        {option1}
      </span>
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`w-14 h-7 bg-gray-200 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        aria-pressed={isOption2}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
            isOption2 ? 'translate-x-7' : 'translate-x-0'
          }`}
        />
      </button>
      <span className={`${isOption2 ? 'font-bold' : 'text-gray-500'}`}>
        {option2}
      </span>
    </div>
  );
}
