import { useMutation } from "@apollo/client/react";
import { useState } from "react";

import { useMode } from "../../context/modeContext";
import { SIGN_UP } from "../../graphql/operations";
import {
  type FormErrors,
  formFields,
  handleChange,
  handleSubmit,
  type SignUpFormData,
} from "../../services/signUpForm.services";
import type { Avatar } from "../../types/Avatar.types";

import AvatarSelector from "../avatarSelector/AvatarSelector";
import FormField from "../formField/FormField";
import { Loader } from "../loader/Loader";
import MainButton from "../mainButton/MainButton";

import classes from "./SignUpForm.module.scss";

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
              (formData[field.id as keyof typeof formData] as string) ?? ""
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
      {error && (
        <p style={{ color: "red", fontSize: "14px", margin: "10px 0" }}>
          {error.message === "Email already in use"
            ? "Cette adresse e-mail est déjà utilisée."
            : "Une erreur est survenue lors de l'inscription. Veuillez réessayer."}
        </p>
      )}
      <div className={classes["sign-up-form__submit"]}>
        <MainButton
          type="submit"
          content={loading ? <Loader /> : "INSCRIS-TOI"}
          mode={mode}
        />
      </div>
    </form>
  );
}
