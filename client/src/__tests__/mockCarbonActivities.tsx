export interface MockActivityType {
    id: number;
    name: string;
    category: string;
}

export const mockCarbonActivities: MockActivityType[] = [
    {
        id: 1,
        name: "Voiture thermique",
        category: "transport"
    },
    {
        id: 2,
        name: "Voiture électrique",
        category: "transport"
    },
    {
        id: 3,
        name: "Train",
        category: "transport"
    },
    {
        id: 4,
        name: "Avion court courrier",
        category: "transport"
    },
    {
        id: 5,
        name: "Avion long courrier",
        category: "transport"
    },
    {
        id: 6,
        name: "Bus",
        category: "transport"
    },
    {
        id: 7,
        name: "Métro",
        category: "transport"
    },
    {
        id: 8,
        name: "Vélo électrique",
        category: "transport"
    },
    {
        id: 9,
        name: "Boeuf",
        category: "alimentation"
    },
    {
        id: 10,
        name: "Poulet",
        category: "alimentation"
    },
    {
        id: 11,
        name: "Poisson",
        category: "alimentation"
    },
    {
        id: 12,
        name: "Légumes",
        category: "alimentation"
    },
    {
        id: 13,
        name: "Fruits",
        category: "alimentation"
    },
    {
        id: 14,
        name: "Produits laitiers",
        category: "alimentation"
    },
    {
        id: 15,
        name: "Céréales",
        category: "alimentation"
    },
    {
        id: 16,
        name: "Électricité",
        category: "energie"
    },
    {
        id: 17,
        name: "Gaz naturel",
        category: "energie"
    },
    {
        id: 18,
        name: "Fioul domestique",
        category: "energie"
    },
    {
        id: 19,
        name: "Chauffage urbain",
        category: "energie"
    },
    {
        id: 20,
        name: "Vêtements",
        category: "consommation"
    },
    {
        id: 21,
        name: "Électronique",
        category: "consommation"
    },
    {
        id: 22,
        name: "Meubles",
        category: "consommation"
    },
    {
        id: 23,
        name: "Streaming vidéo",
        category: "numerique"
    },
    {
        id: 24,
        name: "Envoi d'email",
        category: "numerique"
    },
    {
        id: 25,
        name: "Stockage cloud",
        category: "numerique"
    }
];

export const getActivityByCategory = (category: string) => {
    return mockCarbonActivities.filter(activity => activity.category === category)
};

export const categories = [
    { value: "transport", label: "Transport" },
    { value: "alimentation", label: "Alimentation" },
    { value: "energie", label: "Énergie" },
    { value: "consommation", label: "Consommation" },
    { value: "numerique", label: "Numérique" }
];