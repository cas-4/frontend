import { ReactNode } from "react";

export interface FormFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    className?: string;
    children?: ReactNode;
}

export const FormField = ({ 
    label, 
    name, 
    value, 
    onChange, 
    type = "text", 
    placeholder,
    className = "",
    children 
  }: FormFieldProps) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
          placeholder={placeholder}
        />
        {children}
      </div>
    </div>
  );