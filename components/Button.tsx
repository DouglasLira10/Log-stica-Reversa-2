
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  const baseClasses = "w-full sm:w-auto font-bold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out text-base";
  
  const variantClasses = {
    primary: "bg-[#FFC72C] text-[#004d9c] hover:bg-yellow-400 focus:ring-yellow-500 disabled:bg-yellow-200 disabled:cursor-not-allowed",
    secondary: "bg-white text-[#004d9c] border border-[#004d9c] hover:bg-gray-100 focus:ring-[#004d9c]",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button;