export type Activity = {
  id: number;
  title: string;
  quantity?: number;
  date: string;
  co2_equivalent: number;
  userId: number;
  type: Type;
};

export type Type = {
  id: number;
  title: string;
  quantity_unit: string;
  category: Category;
  category_id?: number;
};

export type Category = {
  id: number;
  title: string;
};
