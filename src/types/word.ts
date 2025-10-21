export interface Word {
  id?: string; // UUID généré par Prisma
  word: string;
  translation: string;
  pronunciation?: string | null;
  categories?: Category[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id?: string;
  name: string;
  words?: Word[];
}

// Interface pour la création d'un mot (sans les champs optionnels)
export interface CreateWordDto {
  word: string;
  translation: string;
  pronunciation?: string | null;
  categoryNames?: string[]; // Noms des catégories à associer
}

// Interface pour la mise à jour d'un mot (tous les champs optionnels sauf l'ID)
export interface UpdateWordDto extends Partial<CreateWordDto> {
  id: string;
}
