import { useState } from "react";

import {
  handleChange,
  handleSubmit,
  formFields,
  type SignUpFormData,
  type FormErrors,
} from "../../services/signUpForm.services";

import FormField from "./FormField";

export default function SignUpForm() {
  const [formData, setFormData] = useState<SignUpFormData>({});
  const [errors, setErrors] = useState<FormErrors>({
    emailMismatch: false,
    passwordMismatch: false,
  });

  return (
    <form onSubmit={(event) => handleSubmit(event, formData, errors)}>
      {formFields.map((field) => (
        <div key={field.id}>
          <FormField
            label={field.label}
            type={field.type}
            id={field.id}
            name={field.id}
            value={formData[field.id as keyof typeof formData] ?? ""}
            onChange={(event) =>
              handleChange(event, formData, setFormData, setErrors)
            }
            placeholder={field.placeholder}
          />
          {field.id === "confirmEmail" && errors.emailMismatch && (
            <p style={{ color: "red", fontSize: "14px", margin: "5px 0" }}>
              Les adresses e-mail ne correspondent pas
            </p>
          )}
          {field.id === "confirmPassword" && errors.passwordMismatch && (
            <p style={{ color: "red", fontSize: "14px", margin: "5px 0" }}>
              Les mots de passe ne correspondent pas
            </p>
          )}
        </div>
      ))}
      <button type="submit">S'inscrire</button>
    </form>
  );
}
