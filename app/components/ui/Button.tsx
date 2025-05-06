import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border border-[rgb(var(--primary))] text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-light))] hover:text-white',
};

const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-5 text-base',
  lg: 'py-3 px-7 text-lg',
};

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', fullWidth = false, icon, className = '', children, ...props }) => {
  const base = 'flex items-center justify-center space-x-2 font-semibold rounded-md transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2';
  const vw = variantStyles[variant];
  const sz = sizeStyles[size];
  const fw = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${base} ${vw} ${sz} ${fw} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}; 