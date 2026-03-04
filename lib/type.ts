import { z } from "zod";

export type FormState =
  | {
      error?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const registerFormSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.string().email("Veuillez entrer un email valide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  language: z.string().min(1, "Veuillez selectionner une langue"),
});

export const loginFormSchema = z.object({
  email: z.string().email("Veuillez entrer un email valide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export interface List {
  id: string;
  name: string;
}

export interface Words {
  id: number;
  list_id: number;
  word_id: number;
  review: boolean;
  word: Word;
};

export interface Word {
  id: number;
  word: string;
  translation: string;
  pronunciation: string;
  score: number | null;
};
// export interface Word {
//   id: number;
//   word: string;
//   translation: string;
//   pronunciation: string;
//   score: number | null;
// };

export interface ListWords {
  count: number;
  list: List;
  words: Words[];
};


export interface Card {
  id: string;
  front: string;
  back: string;
}

export interface CardParam {
  random: boolean;
  translationOnVerso: boolean;
}

export interface LastList {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface DashboardData {
  totalWords: number;
  completed: Word[];
  mastered: Word[];
  learning: Word[];
  toReview: Word[];
  lastListLearned: LastList;
}

export interface StatsProps {
  stats: {
    mastered: number;
    learning: number;
    toReview: number;
    totalWords: number;
  };
  words: DashboardData;
}







export interface BaseResponse {
  data: any[];
}

export interface ListResponse {
  list: List;
  words: Words[];
  count: number;
};

export interface WordsCardResponse {
  list: List;
  words: Words[];
  count: number;
}