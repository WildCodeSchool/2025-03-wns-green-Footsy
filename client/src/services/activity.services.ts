import type { SortOption } from "../components/historyFilters/HistoryFilters";
import type { Activity } from "../types/Activity.types";

export const filterActivitiesByCategory = (
  activities: Activity[],
  categoryId: number | undefined
): Activity[] => {
  if (!categoryId) {
    return activities;
  }

  return activities.filter(
    (activity) => activity.type.category.id === categoryId
  );
};

export const sortActivities = (
  activities: Activity[],
  sortBy: SortOption
): Activity[] => {
  const sorted = [...activities].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "co2-desc":
        return b.co2_equivalent - a.co2_equivalent;
      case "co2-asc":
        return a.co2_equivalent - b.co2_equivalent;
      case "category":
        return a.type.category.title.localeCompare(b.type.category.title);
      default:
        return 0;
    }
  });

  return sorted;
};

export const groupActivities = (
  activities: Activity[],
  sortBy: SortOption
): Record<string, Activity[]> => {
  const groups: Record<string, Activity[]> = {};

  activities.forEach((activity) => {
    let groupKey: string;

    if (sortBy === "category") {
      groupKey = activity.type.category.title;
    } else if (sortBy.startsWith("date")) {
      const date = new Date(activity.date);
      groupKey = date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } else {
      groupKey = "all";
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(activity);
  });

  return groups;
};

export const processActivities = (
  activities: Activity[],
  categoryId: number | undefined,
  sortBy: SortOption
) => {
  const filtered = filterActivitiesByCategory(activities, categoryId);
  const sorted = sortActivities(filtered, sortBy);
  const grouped = groupActivities(sorted, sortBy);

  return {
    filtered: sorted,
    grouped,
  };
};
