import Link from "next/link";
import { logoutAction } from "@/app/actions";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/game/snake", label: "Snake" },
  { href: "/shop", label: "Tienda" },
  { href: "/missions", label: "Misiones" },
  { href: "/profile", label: "Perfil" },
  { href: "/ranking", label: "Ranking" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-moss">
                Jocs IO
              </p>
              <h1 className="mt-1 text-2xl font-black text-ink sm:text-3xl">
                Plataforma de juegos
              </h1>
            </Link>

            <form action={logoutAction}>
              <button
                className="h-10 w-full rounded-lg border border-ink/15 bg-white px-4 text-sm font-bold text-ink transition hover:border-moss hover:text-moss sm:w-auto"
                type="submit"
              >
                Cerrar sesión
              </button>
            </form>
          </div>

          <nav className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold sm:grid-cols-3 lg:grid-cols-6">
            {navItems.map((item) => (
              <Link
                className="rounded-lg border border-moss/15 bg-mist px-3 py-2 text-center text-ink transition hover:border-moss hover:bg-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {children}
      </div>
    </main>
  );
}
