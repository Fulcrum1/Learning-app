"use client";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../../lib/auth";

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(register, undefined);

  return (
    <div>
      <form action={formAction} className="space-y-6">
        {state?.message && (
          <p className="text-red-500 text-sm">{state.message}</p>
        )}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Nom complet
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            placeholder="Jean Dupont"
            // required
          />
        </div>
        {state?.error && (
          <p className="text-red-500 text-sm">{state?.error?.name}</p>
        )}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            placeholder="votre@email.com"
            // required
          />
        </div>
        {state?.error && (
          <p className="text-red-500 text-sm">{state?.error?.email}</p>
        )}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            placeholder="••••••••"
            // required
          />
        </div>
        {state?.error && (
          <p className="text-red-500 text-sm">{state?.error?.password}</p>
        )}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            placeholder="••••••••"
            // required
          />
        </div>
        {/* {state?.error && (
          <p className="text-red-500 text-sm">
            {state?.error?.confirmPassword}
          </p>
        )} */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "En cours..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
