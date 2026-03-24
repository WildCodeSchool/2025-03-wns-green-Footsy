import { toast } from "react-toastify";
import { z } from "zod";

import { AvatarSchema, type Avatar } from "../types/Avatar.types";

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
  passwordInvalid: boolean;
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

const signUpFormSchema = z
  .object({
    name: z.string().trim().min(1, "Le nom est requis."),
    surname: z.string().trim().min(1, "Le prénom est requis."),
    birthdate: z
      .string()
      .trim()
      .min(1, "La date de naissance est requise.")
      .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: "La date de naissance est invalide.",
      }),
    email: z.string().trim().email("L'adresse e-mail est invalide."),
    confirmEmail: z
      .string()
      .trim()
      .email("La confirmation d'e-mail est invalide."),
    password: z
      .string()
      .regex(
        passwordRegex,
        "Le mot de passe doit faire au moins 8 caractères et contenir une majuscule, une minuscule, un chiffre et un caractère spécial.",
      ),
    confirmPassword: z.string(),
    avatar: AvatarSchema,
  })
  .superRefine((data, context) => {
    if (data.email !== data.confirmEmail) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmEmail"],
        message: "Les adresses e-mail ne sont pas identiques.",
      });
    }

    if (data.password !== data.confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Les mots de passe ne sont pas identiques.",
      });
    }
  });

export const formFields = [
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

export const handleChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  formData: SignUpFormData,
  setFormData: React.Dispatch<React.SetStateAction<SignUpFormData>>,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
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
    const passwordMismatch =
      newFormData.password !== "" &&
      newFormData.confirmPassword !== "" &&
      newFormData.password !== newFormData.confirmPassword;

    const passwordValue = (newFormData.password as string) ?? "";
    const passwordInvalid =
      passwordValue !== "" && !passwordRegex.test(passwordValue);

    setErrors((prev) => ({
      ...prev,
      passwordMismatch,
      passwordInvalid,
    }));
  }
};

export const handleSubmit = async (
  event: React.FormEvent,
  formData: SignUpFormData,
  errors: FormErrors,
  // biome-ignore lint/suspicious/noExplicitAny: Apollo Client mutation function type
  signUpMutation: any,
) => {
  event.preventDefault();

  const parsedForm = signUpFormSchema.safeParse(formData);
  if (!parsedForm.success) {
    toast.error(parsedForm.error.issues[0]?.message ?? "Formulaire invalide.");
    return;
  }

  if (errors.emailMismatch || errors.passwordMismatch) {
    toast.error(
      "Veuillez corriger les erreurs avant de soumettre le formulaire.",
    );
    return;
  }

  if (errors.passwordInvalid) {
    toast.error(
      "Le mot de passe doit faire au moins 8 caractères et contenir une majuscule, une minuscule, un chiffre et un caractère spécial.",
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
          birthdate: new Date(formData.birthdate).toISOString(),
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

    return "success";
  } catch (error) {
    if (error instanceof Error && error.message === "Email already in use") {
      toast.error("Cette adresse e-mail est déjà utilisée.");
      return;
    }
    toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
  }
};
