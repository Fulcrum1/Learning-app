// lib/list-form.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { Word } from "./type";

interface Form {
  name: string;
  userId: string;
  words: Word[] | null;
  randomWords?: number;
}

interface FormContextType {
  formData: Form;
  setFormData: React.Dispatch<React.SetStateAction<Form>>;
  randomCount: number;
  setRandomCount: React.Dispatch<React.SetStateAction<number>>;
  selectedWords: Word[];
  setSelectedWords: React.Dispatch<React.SetStateAction<Word[]>>;
}

const FormContext = createContext<FormContextType | null>(null);

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<Form>({
    name: "",
    userId: "",
    words: [],
    randomWords: 0,
  });
  const [randomCount, setRandomCount] = useState(1);
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);

  return (
    <FormContext.Provider value={{
      formData, setFormData,
      randomCount, setRandomCount,
      selectedWords, setSelectedWords,
    }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) throw new Error("useForm must be used within a FormProvider");
  return context;
}