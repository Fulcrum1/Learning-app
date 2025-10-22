export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// If word.categories only has the 'name' field:
export type CategoryNameOnly = Pick<Category, "name">;
