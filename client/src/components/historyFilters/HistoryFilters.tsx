import type { Category } from "../../types/Activity.types";
import classes from "./HistoryFilters.module.scss";

type SortOption =
  | "date-desc"
  | "date-asc"
  | "co2-desc"
  | "co2-asc"
  | "category";

type HistoryFiltersProps = {
  categories: Category[];
  selectedCategory: number | undefined;
  sortBy: SortOption;
  onCategoryChange: (categoryId: number | undefined) => void;
  onSortChange: (sortBy: SortOption) => void;
};

export function HistoryFilters({
  categories,
  selectedCategory,
  sortBy,
  onCategoryChange,
  onSortChange,
}: HistoryFiltersProps) {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "" ? undefined : Number(e.target.value);
    onCategoryChange(value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as SortOption);
  };

  return (
    <aside className={classes.filters}>
      <div className={classes.filters__group}>
        <label htmlFor="category-filter" className={classes.filters__label}>
          Catégorie
        </label>
        <select
          id="category-filter"
          className={classes.filters__select}
          value={selectedCategory ?? ""}
          onChange={handleCategoryChange}
        >
          <option value={undefined}>Toutes</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      <div className={classes.filters__group}>
        <label htmlFor="sort-select" className={classes.filters__label}>
          Trier par
        </label>
        <select
          id="sort-select"
          className={classes.filters__select}
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="date-desc">Date ↓</option>
          <option value="date-asc">Date ↑</option>
          <option value="co2-desc">CO₂ ↓</option>
          <option value="co2-asc">CO₂ ↑</option>
          <option value="category">Catégorie A-Z</option>
        </select>
      </div>
    </aside>
  );
}

export type { SortOption };
