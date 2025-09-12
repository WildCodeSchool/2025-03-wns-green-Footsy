import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import { useMode } from "../../context/modeContext";
import { SIGN_UP } from "../../graphql/operations";
import {
  handleChange,
  handleSubmit,
  type FormErrors,
  type SignUpFormData,
} from "../../services/signUpForm.services";

import AvatarSelector, { type Avatar } from "../avatarSelector/AvatarSelector";
import FormField from "../formField/FormField";
import MainButton from "../mainButton/MainButton";

import classes from "./SignUpForm.module.scss";

const formFields = [
  {
    label: "Prénom",
    type: "text",
    id: "surname",
    placeholder: "Jane",
  },
  {
    label: "Date de naissance",
    type: "date",
    id: "birthdate",
  },
  {
    label: "Mail",
    type: "email",
    id: "email",
    placeholder: "jane.doe@exemple.com",
  },
  {
    label: "Confirmer le mail",
    type: "email",
    id: "confirmEmail",
  },
  {
    label: "Mot de passe",
    type: "password",
    id: "password",
    placeholder: "motDePasse1234",
  },
  {
    label: "Confirmer le mot de passe",
    type: "password",
    id: "confirmPassword",
  },
];

export default function SignUpForm() {
  const { mode } = useMode();

  const [formData, setFormData] = useState<SignUpFormData>({});
  const [errors, setErrors] = useState<FormErrors>({
    emailMismatch: false,
    passwordMismatch: false,
  });

  const [signUpMutation, { loading, error }] = useMutation(SIGN_UP);

  const handleAvatarSelect = (avatar: Avatar) => {
    setFormData((prev) => ({
      ...prev,
      avatar,
    }));
  };

  return (
    <form
      onSubmit={(event) =>
        handleSubmit(event, formData, errors, signUpMutation)
      }
      className={classes["sign-up-form"]}
    >
      <div className={classes["sign-up-form__header"]}>
        <div className={classes["sign-up-form__avatar"]}>
          <AvatarSelector
            selectedAvatar={formData.avatar}
            onAvatarSelect={handleAvatarSelect}
            label="Choisir votre avatar"
          />
        </div>
        <div className={classes["sign-up-form__name"]}>
          <FormField
            label="Nom"
            type="text"
            id="name"
            name="name"
            value={(formData.name as string) ?? ""}
            onChange={(event) =>
              handleChange(event, formData, setFormData, setErrors)
            }
            placeholder="Doe"
          />
        </div>
      </div>

      {formFields.map((field) => (
        <div key={field.id}>
          <FormField
            label={field.label}
            type={field.type}
            id={field.id}
            name={field.id}
            value={
              field.id === "avatar"
                ? ""
                : (formData[field.id as keyof typeof formData] as string) ?? ""
            }
            onChange={(event) =>
              handleChange(event, formData, setFormData, setErrors)
            }
            placeholder={field.placeholder}
          />
          {field.id === "confirmEmail" && errors.emailMismatch && (
            <p style={{ color: "red", fontSize: "14px", margin: "5px 0" }}>
              Les adresses e-mail ne sont pas identiques
            </p>
          )}
          {field.id === "confirmPassword" && errors.passwordMismatch && (
            <p style={{ color: "red", fontSize: "14px", margin: "5px 0" }}>
              Les mots de passe ne sont pas identiques
            </p>
          )}
        </div>
      ))}

      <div className={classes["sign-up-form__submit"]}>
        <MainButton
          type="submit"
          content={loading ? "En cours..." : "INSCRIS-TOI"}
          mode={mode}
        />
      </div>
      {error && (
        <p style={{ color: "red", fontSize: "14px", margin: "10px 0" }}>
          {error.message === "Email already in use"
            ? "Cette adresse e-mail est déjà utilisée."
            : "Une erreur est survenue lors de l'inscription. Veuillez réessayer."}
        </p>
      )}
    </form>
  );
}
