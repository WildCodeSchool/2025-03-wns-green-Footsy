import { toast } from "react-toastify";
import { z } from "zod";
import type { User } from "../types/User.types";

export type ActivityFormData = {
  id?: number;
  title: string;
  date: string;
  category_id: number;
  type_id: number;
  quantity: number;
  co2_equivalent: number;
  user_id: number;
};

const activityFormSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().trim().min(1, "Le titre est requis."),
  date: z
    .string()
    .trim()
    .min(1, "La date est requise.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "La date est invalide.",
    }),
  category_id: z.number().int().nonnegative(),
  type_id: z.number().int().positive("Le type d'activité est requis."),
  quantity: z.number().positive("La quantité doit être un nombre positif."),
  co2_equivalent: z
    .number()
    .nonnegative("L'équivalent CO2 doit être un nombre positif ou nul."),
  user_id: z.number().int().nonnegative(),
});

export const activityFormFields = [
  {
    label: "Quel jour ?",
    type: "date",
    id: "date",
    placeholder: "JJ/MM/AAAA",
  },
  {
    label: "Catégorie",
    type: "select",
    id: "category_id",
    placeholder: "Choisissez une catégorie",
  },
  {
    label: "Type d'activité",
    type: "select",
    id: "type_id",
    placeholder: "Choisissez un type d'activité",
  },
  {
    label: "Titre",
    type: "text",
    id: "title",
    placeholder: "Donnez un titre à votre activité",
  },
  {
    label: "Durée / Quantité",
    type: "number",
    id: "quantity",
    placeholder: "0",
  },
];

export const handleActivityChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  formData: ActivityFormData,
  setFormData: React.Dispatch<React.SetStateAction<ActivityFormData>>
) => {
  const { id, value } = event.target;

  let processedValue: string | number;

  if (
    id === "type_id" ||
    id === "quantity" ||
    id === "co2_equivalent" ||
    id === "category_id"
  ) {
    if (value === "") {
      processedValue = 0;
    } else {
      processedValue = Number(value);
    }
  } else {
    processedValue = value;
  }

  const newFormData = {
    ...formData,
    [id]: processedValue,
  };

  setFormData(newFormData);
};

export const handleActivitySubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  formData: ActivityFormData,
  user: User | undefined,
  // biome-ignore lint/suspicious/noExplicitAny: Apollo Client mutation function type
  createOrUpdateActivity: any,
  isEditMode = false
) => {
  event.preventDefault();

  if (!user) {
    toast.error("Vous devez être connecté pour ajouter une activité.");
    return;
  }

  const parsedForm = activityFormSchema.safeParse(formData);
  if (!parsedForm.success) {
    toast.error(parsedForm.error.issues[0]?.message ?? "Formulaire invalide.");
    return;
  }

  if (
    !formData.title ||
    !formData.date ||
    !formData.type_id ||
    formData.type_id === 0 ||
    !formData.quantity
  ) {
    toast.error("Veuillez remplir tous les champs.");
    return;
  }

  if (formData.quantity <= 0) {
    toast.error("La quantité doit être un nombre positif.");
    return;
  }

  if (formData.quantity === 0) {
    toast.error("Veuillez remplir tous les champs.");
    return;
  }

  if (formData.co2_equivalent < 0) {
    toast.error("L'équivalent CO2 doit être un nombre positif ou nul.");
    return;
  }

  try {
    // Convert date string (YYYY-MM-DD) to ISO format for GraphQL Date scalar
    const dateISO = new Date(formData.date).toISOString();

    const variables =
      isEditMode && formData.id
        ? {
          data: {
            id: formData.id,
            title: formData.title,
            date: dateISO,
            type_id: formData.type_id,
            quantity: formData.quantity,
            co2_equivalent: formData.co2_equivalent,
            user_id: user.id,
          },
        }
        : {
          data: {
            title: formData.title,
            date: dateISO,
            type_id: formData.type_id,
            quantity: formData.quantity,
            co2_equivalent: formData.co2_equivalent,
            user_id: user.id,
          },
        };

    await createOrUpdateActivity({ variables });

    toast.success(
      isEditMode
        ? "Activité modifiée avec succès !"
        : "Activité ajoutée avec succès !"
    );
    return "success";
  } catch (error) {
    console.error(
      `Erreur lors de ${isEditMode ? "la modification" : "l'ajout"
      } de l'activité:`,
      error
    );
    toast.error(
      `Une erreur est survenue lors de ${isEditMode ? "la modification" : "l'ajout"
      } de l'activité. Veuillez réessayer.`
    );
  }
};
