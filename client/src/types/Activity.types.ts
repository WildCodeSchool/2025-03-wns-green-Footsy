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
};

export type Category = {
  id: number;
  title: string;
};
