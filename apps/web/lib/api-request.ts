// import { getSession } from "./session";

const getLanguage = () => {
  return localStorage.getItem("language") || "fr";
};

// const key = getSession();

export const apiRequest = {
  get: (url: string) =>
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": getLanguage(),
        // Authorization: `Bearer ${key}`,
      },
    }),
  post: (url: string, data: any) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": getLanguage(),
        // Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(data),
    }),
};
