import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-md rounded-xl border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-moss">
            Jocs IO
          </p>
          <h1 className="mt-2 text-3xl font-black text-ink">Acceso familiar</h1>
          <p className="mt-2 text-sm leading-6 text-ink/70">
            Entra para preparar partidas, misiones y ranking antes de construir el
            juego completo.
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
