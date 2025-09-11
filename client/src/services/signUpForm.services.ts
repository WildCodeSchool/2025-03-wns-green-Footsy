export type SignUpFormData = {
  name?: string;
  surname?: string;
  birthdate?: string;
  email?: string;
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
};

export type FormErrors = {
  emailMismatch: boolean;
  passwordMismatch: boolean;
};

export const formFields = [
  {
    label: "Nom",
    type: "text",
    id: "name",
    placeholder: "Doe",
  },
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
    placeholder: "",
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
    placeholder: "jane.doe@exemple.com",
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
    placeholder: "motDePasse1234",
  },
];

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
    alert("Veuillez corriger les erreurs avant de soumettre le formulaire.");
    return;
  }

  if (
    !formData.name ||
    !formData.surname ||
    !formData.birthdate ||
    !formData.email ||
    !formData.password
  ) {
    alert("Veuillez remplir tous les champs.");
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
            // TO DO: add avatar selection feature
            id: 1,
            title: "Avatar par défaut",
            image: "default-avatar.png",
          },
        },
      },
    });

    alert("Inscription réussie !");
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    alert("Erreur lors de l'inscription. Veuillez réessayer.");
  }
};
