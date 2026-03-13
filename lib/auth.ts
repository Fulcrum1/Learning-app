"use server";

import { BACKEND_URL } from "./constants";
import { createSession, getSession } from "./session";
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
  });
  
  if (!validatedData.success) {
    return {
      error: validatedData.error.flatten().fieldErrors,
    };
  }

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
    console.log(response);
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

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validatedData.data),
  });

  console.log("Backend response status:", response.status);
  console.log("Backend response body:", await response.clone().text());

  if (response.ok) {
    try {
      const result = await response.json();
      console.log("Result:", result);
      await createSession({ 
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
        accessToken: result.token,
      });
    } catch (err) {
      console.error("Error after response.ok:", err);
      return { message: "Session creation failed: " + err };
    }
    redirect("/");
  } else {
    return { message: response.status + " " + response.statusText };
  }
};
