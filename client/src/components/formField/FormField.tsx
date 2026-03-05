import type React from "react";

import { useMode } from "../../context/modeContext";

import classes from "./FormField.module.scss";

type SelectOption = {
  id: number;
  name?: string;
  title?: string;
};

type FormFieldProps = {
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
};

export default function FormField({
  label,
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = true,
  options,
}: FormFieldProps) {
  const { mode } = useMode();

  return (
    <div className={classes["form-field"]}>
      <label
        htmlFor={id}
        className={`${classes["form-field__label"]} ${
          classes[`form-field__label--${mode}`]
        }`}
      >
        {label}
        {required && (
          <span className={classes["form-field__label--required"]}> *</span>
        )}
      </label>
      {type === "select" ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${classes["form-field__input"]} ${
            classes[`form-field__input--${mode}`]
          }`}
        >
          <option value="">{placeholder}</option>
          {options?.map((option) => (
            <option key={String(option.id)} value={String(option.id)}>
              {option.name || option.title}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`${classes["form-field__input"]} ${
            classes[`form-field__input--${mode}`]
          }`}
        />
      )}
    </div>
  );
}
