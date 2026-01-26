import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  startAdornment,
  endAdornment,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  
  const widthClass = fullWidth ? 'w-full' : '';
  const errorClass = error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
  
  const inputBaseClass = `block rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50 sm:text-sm ${errorClass}`;
  const adornmentClass = startAdornment ? 'pl-10' : '';
  
  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {startAdornment && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {startAdornment}
          </div>
        )}
        
        <input
          ref={ref}
          className={`${inputBaseClass} ${adornmentClass} ${widthClass}`}
          {...props}
        />
        
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            {endAdornment}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-error-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';