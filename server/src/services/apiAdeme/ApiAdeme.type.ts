export interface Categorie {
  id: number;
  name: string;
  slug: string;
}

export interface Type {
  name: string;
  slug: string;
  ecv: number;
}

export interface ApiResponse<T> {
  data: T[];
}

export type QuantityUnit = "unité" | "kg" | "L" | "km" | "m²";

export const THEMATIQUE_UNITS: Record<number, QuantityUnit> = {
  1: "unité",   // Numérique
  2: "kg",      // Alimentation
  3: "L",       // Boisson
  4: "km",      // Transport
  5: "unité",   // Habillement
  6: "unité",   // Électroménager
  7: "unité",   // Mobilier
  8: "m²",      // Chauffage
  9: "kg",      // Fruits et légumes
  10: "unité",  // Usage numérique
};