import type React from "react";

interface FormFieldProps {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export default function FormField({
  label,
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = true,
}: FormFieldProps) {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </>
  );
}
