import { toast } from "react-toastify";
export type ActivityFormData = {
    title: string;
    date: string;
    type_id: number;  // On utilise l'ID du type au lieu de la chaîne
    quantity: number;
    co2_equivalent: number;
    user_id?: number;  // Optionnel pour l'instant, à rendre obligatoire plus tard avec l'auth
}

export const activityFormFields = [
    {
        label: "Quel jour ?",
        type: "date",
        id: "date",
        placeholder: "JJ/MM/AAAA",
    },
      {
        label: "Titre",
        type: "text",
        id: "title",
        placeholder: "Donnez un titre à votre activité",
    },
    {
        label: "Type d'activité",
        type: "select",
        id: "type_id",
        placeholder: "Choisissez un type d'activité",
    },
    {
        label: "Durée / Quantité",
        type: "number",
        id: "quantity",
        placeholder: "Exemple: 30 (minutes), 10 (km)...",
    },
    {
        label: "Équivalent CO2 (en kg)",
        type: "number",
        id: "co2_equivalent",
        placeholder: "Exemple: 2.5",
    }
];

export const handleActivityChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    formData: ActivityFormData,
    setFormData: React.Dispatch<React.SetStateAction<ActivityFormData>>,
) => {
    const { id, value } = event.target;

    let processedValue: string | number;
    
    if(id === 'type_id' || id === 'quantity' || id === 'co2_equivalent'){
        if(value === '') {
            processedValue = id === 'type_id' ? '' : 0;
        } else {
            processedValue = Number(value);
        }
    } else { processedValue = value;
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
    user: User,
    // biome-ignore lint/suspicious/noExplicitAny: Apollo Client mutation function type
    createActivity: any
) => {
    event.preventDefault();

    console.log('📋 FormData reçu:', formData);

   if (!formData.title || !formData.date || !formData.type_id || formData.type_id === 0) {
    console.log('❌ Champs manquants ou invalides:', {
        title: formData.title,
        date: formData.date,
        type_id: formData.type_id
    });
    toast.error("Veuillez remplir tous les champs.");
    return;
}

    if (formData.quantity <= 0) {
        toast.error("La quantité doit être un nombre positif.");
        return;
    }

    if (formData.co2_equivalent < 0) {
        toast.error("L'équivalent CO2 doit être un nombre positif ou nul.");
        return;
    }

    console.log('✅ Validation OK, envoi de la mutation...');
    console.log('📤 Variables envoyées:', { data: formData });

    try {
        await createActivity({
            variables: {
                data: {
                    ...formData,
                    date: new Date(formData.date).toISOString(),
                }
            }
        });
        toast.success("Activité ajoutée avec succès !");
        return "success";
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'activité:", error);
        toast.error("Une erreur est survenue lors de l'ajout de l'activité. Veuillez réessayer.");
    }
}
