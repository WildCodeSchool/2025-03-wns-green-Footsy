import { toast } from "react-toastify";
import type { Avatar } from "../components/avatarSelector/AvatarSelector";

export type SignUpFormData = {
  name?: string;
  surname?: string;
  birthdate?: string;
  email?: string;
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
  avatar?: Avatar;
};

export type FormErrors = {
  emailMismatch: boolean;
  passwordMismatch: boolean;
};

export const handleChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  formData: SignUpFormData,
  setFormData: React.Dispatch<React.SetStateAction<SignUpFormData>>,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>
) => {
  const { name, value } = event.target;
  const newFormData = {
    ...formData,
    [name]: value,
  };
  setFormData(newFormData);

  if (name === "confirmEmail" || name === "email") {
    setErrors((prev) => ({
      ...prev,
      emailMismatch:
        newFormData.email !== "" &&
        newFormData.confirmEmail !== "" &&
        newFormData.email !== newFormData.confirmEmail,
    }));
  }

  if (name === "confirmPassword" || name === "password") {
    setErrors((prev) => ({
      ...prev,
      passwordMismatch:
        newFormData.password !== "" &&
        newFormData.confirmPassword !== "" &&
        newFormData.password !== newFormData.confirmPassword,
    }));
  }
};

export const handleSubmit = async (
  event: React.FormEvent,
  formData: SignUpFormData,
  errors: FormErrors,
  // biome-ignore lint/suspicious/noExplicitAny: Apollo Client mutation function type
  signUpMutation: any
) => {
  event.preventDefault();

  if (errors.emailMismatch || errors.passwordMismatch) {
    toast.error(
      "Veuillez corriger les erreurs avant de soumettre le formulaire."
    );
    return;
  }

  if (
    !formData.name ||
    !formData.surname ||
    !formData.birthdate ||
    !formData.email ||
    !formData.password ||
    !formData.avatar
  ) {
    toast.error("Veuillez remplir tous les champs et sélectionner un avatar.");
    return;
  }

  try {
    await signUpMutation({
      variables: {
        data: {
          first_name: formData.surname,
          last_name: formData.name,
          email: formData.email,
          birthdate: new Date(formData.birthdate),
          password: formData.password,
          avatar: {
            id: formData.avatar.id,
            title: formData.avatar.title,
            image: formData.avatar.image,
          },
        },
      },
    });

    toast.info("Inscription réussie !");
  } catch (error) {
    if (error instanceof Error && error.message === "Email already in use") {
      toast.error("Cette adresse e-mail est déjà utilisée.");
      return;
    }
    toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
  }
};
