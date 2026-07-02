"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Usuario
        <input
          className="h-12 rounded-lg border border-moss/20 bg-white px-4 text-base font-medium outline-none ring-leaf/30 transition focus:ring-4"
          name="username"
          autoComplete="username"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-ink">
        Contraseña
        <input
          className="h-12 rounded-lg border border-moss/20 bg-white px-4 text-base font-medium outline-none ring-leaf/30 transition focus:ring-4"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        className="h-12 rounded-lg bg-ink px-5 text-base font-bold text-white transition hover:bg-moss disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
