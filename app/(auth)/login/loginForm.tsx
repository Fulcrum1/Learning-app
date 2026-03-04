"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../../lib/auth";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <div>
      {/* Form */}
      {state?.message && (
        <p className="text-red-500 text-center">{state.message}</p>
      )}
      <form action={formAction} className="space-y-6">
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
            required
          />
        </div>

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
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              Se souvenir de moi
            </span>
          </label>
          <a
            href="#"
            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Mot de passe oublié?
          </a>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Connexion...
            </span>
          ) : (
            "Se connecter"
          )}
        </button>
      </form>
    </div>
  );
}
