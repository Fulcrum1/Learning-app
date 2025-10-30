"use server"

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";

export type Session = {
  user: {
    id: string;
    email: string;
    name: string;
  };
    accessToken: string;
  //   refreshToken: string;
};

const secretKey = process.env.SESSION_SECRET_KEY;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookie = (await cookies()).get("session")?.value;

  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as Session;
  } catch (error) {
    console.log(error);
    redirect("/login");
  }
}

export async function destroySession() {
  (await cookies()).delete("session");
}