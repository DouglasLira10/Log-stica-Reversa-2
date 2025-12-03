
import React from 'react';

interface FormFieldProps {
  label: string;
  id: string;
  required?: boolean;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, id, required, children }) => {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-gray-800 font-semibold mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
};

export default FormField;
