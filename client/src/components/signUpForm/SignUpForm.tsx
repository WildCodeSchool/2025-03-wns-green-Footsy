import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMode } from "../../context/modeContext";
import { useCurrentUser } from "../../context/userContext";
import {
  LOGIN,
  type LoginMutationData,
  SIGN_UP,
} from "../../graphql/operations";
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
  const navigate = useNavigate();
  const { mode } = useMode();
  const { refetch } = useCurrentUser();

  const [formData, setFormData] = useState<SignUpFormData>({
    avatar: { id: 5, title: "Mononoke", image: "icon-mononoke.png" },
  });
  const [errors, setErrors] = useState<FormErrors>({
    emailMismatch: false,
    passwordMismatch: false,
    passwordInvalid: false,
  });

  const [signUpMutation, { loading, error }] = useMutation(SIGN_UP);
  const [loginMutation] = useMutation<LoginMutationData>(LOGIN);

  const handleAvatarSelect = (avatar: Avatar) => {
    setFormData((prev) => ({
      ...prev,
      avatar,
    }));
  };

  const submitAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSubmit(e, formData, signUpMutation);

    if (result === "success") {
      try {
        const loginResult = await loginMutation({
          variables: {
            data: { email: formData.email, password: formData.password },
          },
        });

        if (loginResult.data) {
          if (refetch) {
            await refetch();
          }
          navigate("/dashboard");
        }
      } catch {
        console.error(
          "Erreur lors de la connexion après inscription. Essayez de vous reconnecter",
        );
      }
    }
  };

  return (
    <form onSubmit={submitAndLogin} className={classes["sign-up-form"]}>
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
          {field.id === "password" && errors.passwordInvalid && (
            <p style={{ color: "red", fontSize: "14px", margin: "5px 0" }}>
              Le mot de passe doit contenir au moins 8 caractères, une
              majuscule, une minuscule, un chiffre et un caractère spécial.
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
          content={loading ? <Loader /> : "Inscris-toi"}
          mode={mode}
        />
      </div>
    </form>
  );
}
