import { Word } from "./word";

export interface List {
    id: string;
    name: string;
    description?: string;
    words: Word[];
    createdAt: Date;
    updatedAt: Date;
}
