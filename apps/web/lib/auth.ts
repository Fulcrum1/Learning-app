"use server";

import { BACKEND_URL } from "./constants";
import { createSession } from "./session";
import { FormState, registerFormSchema, loginFormSchema } from "./type";
import { redirect } from "next/navigation";

export const register = async (
  state: FormState,
  formData: FormData
): Promise<FormState> => {
  const validatedData = registerFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    // confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedData.success) {
    return {
      error: validatedData.error.flatten().fieldErrors,
    };
  }

  // const response = await fetch(`http://localhost:8000/auth/register`, {
  const response = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData.data),
  });

  if (response.ok) {
    redirect("/login");
  } else {
    return {
      message:
        response.status === 409
          ? "Email already exists"
          : "Something went wrong",
    };
  }
};

export const login = async (
  state: FormState,
  formData: FormData
): Promise<FormState> => {
  const validatedData = loginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedData.success) {
    return {
      error: validatedData.error.flatten().fieldErrors,
    };
  }

  // const response = await fetch(`${BACKEND_URL}/auth/login`, {
  const response = await fetch(`http://127.0.0.1:8000/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData.data),
  });

  if (response.ok) {
    const result = await response.json();
    console.log({result});
    await createSession({
      user: {
        id: result.id,
        email: result.email,
        name: result.name,
      },
    });
    redirect("/");
  } else {
    return {
      message:
        response.status === 409
          ? "Invalid email or password"
          : // : "Something went wrong",
            response.statusText,
    };
  }
};
