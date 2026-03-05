import { describe, expect, it } from "vitest";
import {
  createMockActivity,
  createMockCategory,
  createMockType,
} from "../../__tests__/helpers";
import type { Activity } from "../../types/Activity.types";
import {
  filterActivitiesByCategory,
  groupActivities,
  processActivities,
  sortActivities,
} from "../activity.services";

const transportCategory = createMockCategory({ id: 1, title: "Transport", quantity_unit: "km" });
const alimentationCategory = createMockCategory({
  id: 2,
  title: "Alimentation",
  quantity_unit: "repas"
});
const electroniqueCategory = createMockCategory({
  id: 3,
  title: "Électronique",
  quantity_unit: "unité"
});

const mockActivities: Activity[] = [
  createMockActivity({
    id: 1,
    title: "Vol Paris-Londres",
    quantity: 1,
    date: "2025-03-15",
    co2_equivalent: 250,
    type: createMockType({
      id: 1,
      title: "Vol court-courrier",
      category: transportCategory,
    }),
  }),
  createMockActivity({
    id: 2,
    title: "Repas végétarien",
    quantity: 2,
    date: "2025-03-20",
    co2_equivalent: 15,
    type: createMockType({
      id: 2,
      title: "Repas végétarien",
      category: alimentationCategory,
    }),
  }),
  createMockActivity({
    id: 3,
    title: "Trajet en voiture",
    quantity: 50,
    date: "2025-03-10",
    co2_equivalent: 100,
    type: createMockType({
      id: 3,
      title: "Voiture essence",
      category: transportCategory,
    }),
  }),
  createMockActivity({
    id: 4,
    title: "Achat électronique",
    quantity: 1,
    date: "2025-02-28",
    co2_equivalent: 500,
    type: createMockType({
      id: 4,
      title: "Smartphone",
      category: electroniqueCategory,
    }),
  }),
  createMockActivity({
    id: 5,
    title: "Repas de viande",
    quantity: 1,
    date: "2025-03-20",
    co2_equivalent: 80,
    type: createMockType({
      id: 5,
      title: "Repas avec viande rouge",
      category: alimentationCategory,
    }),
  }),
];

describe("filterActivitiesByCategory", () => {
  it("devrait retourner toutes les activités quand categoryId est undefined", () => {
    const result = filterActivitiesByCategory(mockActivities, undefined);
    expect(result).toEqual(mockActivities);
    expect(result.length).toBe(5);
  });

  it("devrait filtrer les activités par catégorie Transport", () => {
    const result = filterActivitiesByCategory(mockActivities, 1);
    expect(result.length).toBe(2);
    expect(result.every((a) => a.type.category.id === 1)).toBe(true);
    expect(result[0].title).toBe("Vol Paris-Londres");
    expect(result[1].title).toBe("Trajet en voiture");
  });

  it("devrait filtrer les activités par catégorie Alimentation", () => {
    const result = filterActivitiesByCategory(mockActivities, 2);
    expect(result.length).toBe(2);
    expect(result.every((a) => a.type.category.id === 2)).toBe(true);
    expect(result[0].title).toBe("Repas végétarien");
    expect(result[1].title).toBe("Repas de viande");
  });

  it("devrait retourner un tableau vide si aucune activité ne correspond", () => {
    const result = filterActivitiesByCategory(mockActivities, 999);
    expect(result.length).toBe(0);
  });

  it("devrait retourner un tableau vide si les activités sont vides", () => {
    const result = filterActivitiesByCategory([], 1);
    expect(result.length).toBe(0);
  });
});

describe("sortActivities", () => {
  it("devrait trier les activités par date décroissante (plus récent en premier)", () => {
    const result = sortActivities(mockActivities, "date-desc");
    expect(result[0].date).toBe("2025-03-20");
    expect(result[result.length - 1].date).toBe("2025-02-28");
    expect(new Date(result[0].date).getTime()).toBeGreaterThanOrEqual(
      new Date(result[1].date).getTime()
    );
  });

  it("devrait trier les activités par date croissante (plus ancien en premier)", () => {
    const result = sortActivities(mockActivities, "date-asc");
    expect(result[0].date).toBe("2025-02-28");
    expect(result[result.length - 1].date).toBe("2025-03-20");
    expect(new Date(result[0].date).getTime()).toBeLessThanOrEqual(
      new Date(result[1].date).getTime()
    );
  });

  it("devrait trier les activités par CO2 décroissant (plus élevé en premier)", () => {
    const result = sortActivities(mockActivities, "co2-desc");
    expect(result[0].co2_equivalent).toBe(500);
    expect(result[result.length - 1].co2_equivalent).toBe(15);
    expect(result[0].co2_equivalent).toBeGreaterThanOrEqual(
      result[1].co2_equivalent
    );
  });

  it("devrait trier les activités par CO2 croissant (plus faible en premier)", () => {
    const result = sortActivities(mockActivities, "co2-asc");
    expect(result[0].co2_equivalent).toBe(15);
    expect(result[result.length - 1].co2_equivalent).toBe(500);
    expect(result[0].co2_equivalent).toBeLessThanOrEqual(
      result[1].co2_equivalent
    );
  });

  it("devrait trier les activités par catégorie (ordre alphabétique)", () => {
    const result = sortActivities(mockActivities, "category");
    expect(result[0].type.category.title).toBe("Alimentation");
    expect(result[result.length - 1].type.category.title).toBe("Transport");
  });

  it("ne devrait pas modifier le tableau original", () => {
    const original = [...mockActivities];
    sortActivities(mockActivities, "date-desc");
    expect(mockActivities).toEqual(original);
  });

  it("devrait retourner un tableau vide si les activités sont vides", () => {
    const result = sortActivities([], "date-desc");
    expect(result.length).toBe(0);
  });
});

describe("groupActivities", () => {
  it("devrait regrouper par catégorie quand sortBy est 'category'", () => {
    const sorted = sortActivities(mockActivities, "category");
    const result = groupActivities(sorted, "category");

    expect(Object.keys(result).length).toBe(3);
    expect(result.Transport).toBeDefined();
    expect(result.Alimentation).toBeDefined();
    expect(result.Électronique).toBeDefined();
    expect(result.Transport.length).toBe(2);
    expect(result.Alimentation.length).toBe(2);
    expect(result.Électronique.length).toBe(1);
  });

  it("devrait regrouper par date quand sortBy commence par 'date'", () => {
    const sorted = sortActivities(mockActivities, "date-desc");
    const result = groupActivities(sorted, "date-desc");

    expect(Object.keys(result).length).toBe(4);
    expect(result["20 mars 2025"]).toBeDefined();
    expect(result["20 mars 2025"].length).toBe(2);
  });

  it("devrait regrouper par date avec date-asc", () => {
    const sorted = sortActivities(mockActivities, "date-asc");
    const result = groupActivities(sorted, "date-asc");

    expect(Object.keys(result).length).toBe(4);
    expect(result["28 février 2025"]).toBeDefined();
  });

  it("devrait regrouper toutes les activités sous 'all' pour les autres options de tri", () => {
    const sorted = sortActivities(mockActivities, "co2-desc");
    const result = groupActivities(sorted, "co2-desc");

    expect(Object.keys(result).length).toBe(1);
    expect(result.all).toBeDefined();
    expect(result.all.length).toBe(5);
  });

  it("devrait regrouper toutes les activités sous 'all' pour co2-asc", () => {
    const sorted = sortActivities(mockActivities, "co2-asc");
    const result = groupActivities(sorted, "co2-asc");

    expect(Object.keys(result).length).toBe(1);
    expect(result.all).toBeDefined();
    expect(result.all.length).toBe(5);
  });

  it("devrait retourner un objet vide si les activités sont vides", () => {
    const result = groupActivities([], "category");
    expect(Object.keys(result).length).toBe(0);
  });
});

describe("processActivities", () => {
  it("devrait traiter les activités sans filtre de catégorie", () => {
    const result = processActivities(mockActivities, undefined, "date-desc");

    expect(result.filtered.length).toBe(5);
    expect(result.filtered[0].date).toBe("2025-03-20");
    expect(Object.keys(result.grouped).length).toBeGreaterThan(0);
  });

  it("devrait traiter les activités avec filtre de catégorie", () => {
    const result = processActivities(mockActivities, 1, "co2-desc");

    expect(result.filtered.length).toBe(2);
    expect(result.filtered.every((a) => a.type.category.id === 1)).toBe(true);
    expect(result.filtered[0].co2_equivalent).toBe(250);
    expect(result.filtered[1].co2_equivalent).toBe(100);
  });

  it("devrait traiter avec tri par catégorie et filtre", () => {
    const result = processActivities(mockActivities, 2, "category");

    expect(result.filtered.length).toBe(2);
    expect(result.grouped.Alimentation).toBeDefined();
    expect(result.grouped.Alimentation.length).toBe(2);
  });

  it("devrait traiter avec tri par date et groupement par date", () => {
    const result = processActivities(mockActivities, undefined, "date-desc");

    expect(result.filtered.length).toBe(5);
    expect(result.grouped["20 mars 2025"]).toBeDefined();
    expect(result.grouped["20 mars 2025"].length).toBe(2);
  });

  it("devrait traiter avec tri par CO2 et groupement 'all'", () => {
    const result = processActivities(mockActivities, undefined, "co2-asc");

    expect(result.filtered.length).toBe(5);
    expect(result.grouped.all).toBeDefined();
    expect(result.grouped.all.length).toBe(5);
    expect(result.filtered[0].co2_equivalent).toBe(15);
  });

  it("devrait retourner des tableaux vides si aucune activité ne correspond au filtre", () => {
    const result = processActivities(mockActivities, 999, "date-desc");

    expect(result.filtered.length).toBe(0);
    expect(Object.keys(result.grouped).length).toBe(0);
  });

  it("devrait gérer un tableau d'activités vide", () => {
    const result = processActivities([], undefined, "date-desc");

    expect(result.filtered.length).toBe(0);
    expect(Object.keys(result.grouped).length).toBe(0);
  });

  it("devrait combiner filtre, tri et groupement correctement", () => {
    const result = processActivities(mockActivities, 1, "date-asc");

    expect(result.filtered.length).toBe(2);
    expect(result.filtered[0].date).toBe("2025-03-10");
    expect(result.filtered[1].date).toBe("2025-03-15");
    expect(result.grouped["10 mars 2025"]).toBeDefined();
    expect(result.grouped["15 mars 2025"]).toBeDefined();
  });
});
