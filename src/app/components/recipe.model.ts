export interface Recipe {
  id: string;
  title: string;
  ingredients: Ingredient[];
  instructions: string;
  cookingTime: string;
  image?: string | null;
  createdAt: Date;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}
